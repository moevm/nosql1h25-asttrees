package ru.sweetgit.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.sweetgit.backend.entity.EntityQuery;
import ru.sweetgit.backend.model.*;

@Configuration
public class EntityQueryConfiguration {
    @Bean
    public EntityQuery<FullUserModel> userEntityQuery() {
        return new EntityQuery<>(
                "users",
                FullUserModel.class,
                """
                        FOR u IN users
                            LET repoCount = LENGTH(
                            FOR r IN repositories
                                FILTER r.owner == u._id
                                RETURN 1
                            )
                        """,
                """
                        MERGE(
                            u,
                            {
                             id: u._key,
                             arangoId: u._id,
                             repositoryCount: repoCount
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullRepositoryModel> repositoryEntityQuery() {
        return new EntityQuery<>(
                "repositories",
                FullRepositoryModel.class,
                """
                        FOR repo IN repositories
                            LET owner = DOCUMENT(repo.owner)
                            LET repoBranches = (
                                FOR branch IN branches
                                    FILTER branch.repository == repo._id
                                    RETURN 1
                            )
                            LET repoCommits = (
                                FOR branch IN branches
                                    FILTER branch.repository == repo._id
                                    FOR commit IN 1..1 OUTBOUND branch._id branch_commits
                                        RETURN DISTINCT commit._id
                            )
                        """,
                """
                        MERGE(
                            repo,
                            {
                             id: repo._key,
                             arangoId: repo._id,
                            },
                            {
                             owner: owner,
                             branchCount: LENGTH(repoBranches),
                             commitCount: LENGTH(repoCommits)
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullCommitModel> commitEntityQuery() {
        return new EntityQuery<>(
                "commits",
                FullCommitModel.class,
                """
                        FOR c IN commits
                            LET oneBranchForCommit = FIRST(
                                FOR branch_node IN 1..1 INBOUND c._id branch_commits
                                    LIMIT 1
                                    RETURN branch_node
                            )
                            LET repoDoc = DOCUMENT(oneBranchForCommit.repository)
                            LET ownerDocForRepo = DOCUMENT(repoDoc.owner)

                            LET branchesLinkedToCommit = (
                                FOR b_node IN 1..1 INBOUND c._id branch_commits
                                    RETURN 1
                            )
                            
                            LET commitFiles = (
                               FOR file in commit_files
                                   FILTER file.commit == c._id
                                   RETURN file
                            )
                            
                            LET filesWithAstCount = COUNT(
                                FOR commitFileDoc in commitFiles
                                    FILTER DOCUMENT(CONCAT("ast_trees/", commitFileDoc.hash)) != null
                                    RETURN 1
                            )
                        """,
                """
                        MERGE(
                            c,
                            {
                                id: c._key,
                                arangoId: c._id
                            },
                            {
                                repository: MERGE(
                                    repoDoc,
                                    {
                                        id: repoDoc._key,
                                        arangoId: repoDoc._id,
                                    },
                                    {
                                         owner: ownerDocForRepo
                                    }
                                ),
                                branchCount: LENGTH(branchesLinkedToCommit),
                                fileCount: LENGTH(commitFiles),
                                fileWithAstCount: filesWithAstCount
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullBranchModel> branchEntityQuery() {
        return new EntityQuery<>(
                "branches",
                FullBranchModel.class,
                """
                        FOR b IN branches
                            LET repoDoc = DOCUMENT(b.repository)
                            LET commitsForThisBranch = (
                                FOR commitNode IN 1..1 OUTBOUND b._id branch_commits
                                    RETURN 1
                            )
                        """,
                """
                        MERGE(
                            b,
                            {
                                id: b._key,
                                arangoId: b._id,
                            },
                            {
                                repository: MERGE(
                                    repoDoc,
                                    {
                                        owner: DOCUMENT(repoDoc.owner)
                                    }
                                ),
                                commitCount: LENGTH(commitsForThisBranch)
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullAstTreeModel> astTreeEntityQuery() {
        return new EntityQuery<>(
                "ast_trees",
                FullAstTreeModel.class,
                """
                        FOR ast_tree IN ast_trees
                            LET rootNodeDoc = DOCUMENT(ast_tree.rootNode)
                        
                            LET traversalData = (
                                FOR v, e, p IN 0..10000 OUTBOUND rootNodeDoc ast_parents
                                    RETURN { depth: LENGTH(p.edges) }
                            )
                        
                            LET treeDepth = LENGTH(traversalData) == 0 ? 0 : MAX(traversalData[*].depth)
                            LET treeSize = LENGTH(traversalData)
                        
                            LET commitFileDoc = FIRST(
                                FOR cf IN commit_files
                                    FILTER cf.hash == ast_tree._key
                                    LIMIT 1
                                    RETURN cf
                            )
                        """,
                """
                        MERGE(
                            ast_tree,
                            {
                                id: ast_tree._key,         // Map _key to id
                                arangoId: ast_tree._id,    // Map _id to arangoId
                                depth: treeDepth,
                                size: treeSize,
                                commitFile: MERGE(
                                    commitFileDoc,
                                    {
                                        id: commitFileDoc._key,
                                        arangoId: commitFileDoc._id,
                                    }
                                )
                            }
                        )
                        """
        );
    }

//    @Bean
//    public Map<String, EntityQuery<?>> entityQueriesByName(List<EntityQuery<?>> entityQueries) {
//        return entityQueries.stream().collect(Collectors.toMap(EntityQuery::name, Function.identity()));
//    }
}

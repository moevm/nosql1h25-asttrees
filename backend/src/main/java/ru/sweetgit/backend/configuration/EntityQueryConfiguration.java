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
                "FOR entity IN users",
                """
                            LET repoCount = LENGTH(
                            FOR r IN repositories
                                FILTER r.owner == entity._id
                                RETURN 1
                            )
                        """,
                """
                        MERGE(
                            entity,
                            {
                             id: entity._key,
                             arangoId: entity._id,
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
                "FOR entity IN repositories",
                """
                            LET owner = DOCUMENT(entity.owner)
                            LET repoBranches = (
                                FOR branch IN branches
                                    FILTER branch.repository == entity._id
                                    RETURN 1
                            )
                            LET repoCommits = (
                                FOR branch IN branches
                                    FILTER branch.repository == entity._id
                                    FOR commit IN 1..1 OUTBOUND branch._id branch_commits
                                        RETURN DISTINCT commit._id
                            )
                        """,
                """
                        MERGE(
                            entity,
                            {
                             id: entity._key,
                             arangoId: entity._id,
                            },
                            {
                             owner: MERGE(
                                owner,
                                {
                                 id: owner._key,
                                 arangoId: owner._id,
                                }
                             ),
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
                "FOR entity IN commits",
                """
                            LET oneBranchForCommit = FIRST(
                                FOR branch_node IN 1..1 INBOUND entity._id branch_commits
                                    LIMIT 1
                                    RETURN branch_node
                            )
                            LET repoDoc = DOCUMENT(oneBranchForCommit.repository)
                            LET ownerDocForRepo = DOCUMENT(repoDoc.owner)
                        
                            LET branchesLinkedToCommit = (
                                FOR b_node IN 1..1 INBOUND entity._id branch_commits
                                    RETURN b_node._key
                            )
                        
                            LET commitFiles = (
                               FOR file in commit_files
                                   FILTER file.commit == entity._id
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
                            entity,
                            {
                                id: entity._key,
                                arangoId: entity._id
                            },
                            {
                                repository: MERGE(
                                    repoDoc,
                                    {
                                        id: repoDoc._key,
                                        arangoId: repoDoc._id,
                                    },
                                    {
                                         owner: MERGE(
                                            ownerDocForRepo,
                                            {
                                                id: ownerDocForRepo._key,
                                                arangoId: ownerDocForRepo._id,
                                            }
                                         )
                                    }
                                ),
                                branches: branchesLinkedToCommit,
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
                "FOR entity IN branches",
                """
                            LET repoDoc = DOCUMENT(entity.repository)
                            LET commitsForThisBranch = (
                                FOR commitNode IN 1..1 OUTBOUND entity._id branch_commits
                                    RETURN commitNode._key
                            )
                            LET owner = DOCUMENT(repoDoc.owner)
                        """,
                """
                        MERGE(
                            entity,
                            {
                                id: entity._key,
                                arangoId: entity._id,
                            },
                            {
                                repository: MERGE(
                                    repoDoc,
                                    {
                                        id: repoDoc._key,
                                        arangoId: repoDoc._id,
                                    },
                                    {
                                        owner: MERGE(
                                            owner,
                                            {
                                                id: owner._key,
                                                arangoId: owner._id,
                                            }
                                        )
                                    }
                                ),
                                commits: commitsForThisBranch,
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
                "FOR entity IN ast_trees",
                """
                            LET rootNodeDoc = DOCUMENT(entity.rootNode)
                        
                            LET traversalData = (
                                FOR v, e, p IN 0..10000 OUTBOUND rootNodeDoc ast_parents
                                    RETURN { depth: LENGTH(p.edges) }
                            )
                        
                            LET treeDepth = LENGTH(traversalData) == 0 ? 0 : MAX(traversalData[*].depth)
                            LET treeSize = LENGTH(traversalData)
                        """,
                """
                        MERGE(
                            entity,
                            {
                                id: entity._key,
                                arangoId: entity._id,
                                depth: treeDepth,
                                size: treeSize
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullCommitFileModel> commitFileEntityQuery() {
        return new EntityQuery<>(
                "commit_files",
                FullCommitFileModel.class,
                "FOR entity IN commit_files",
                """
                        LET commitDoc = DOCUMENT(entity.commit)
                        LET branches = (
                            FOR branchNode IN 1..1 INBOUND commitDoc._id branch_commits
                                RETURN branchNode
                        )
                        LET oneBranchForCommit = FIRST(branches)
                        LET repoDoc = DOCUMENT(oneBranchForCommit.repository)
                        LET ownerDocForRepo = DOCUMENT(repoDoc.owner)
                        LET astTreeExists = entity.hash != null AND DOCUMENT(CONCAT("ast_trees/", entity.hash)) != null
                        """,
                """
                        MERGE(
                            entity,
                            {
                                id: entity._key,
                                arangoId: entity._id,
                                parent: DOCUMENT(entity.parent)._key
                            },
                            {
                                commit: MERGE(
                                    commitDoc,
                                    {
                                        id: commitDoc._key,
                                        arangoId: commitDoc._id,
                                    }
                                ),
                                branchCount: LENGTH(branches),
                                branches: (FOR b IN branches RETURN b._key),
                                repository: MERGE(
                                    repoDoc,
                                    {
                                        id: repoDoc._key,
                                        arangoId: repoDoc._id
                                    },
                                    {
                                        owner: ownerDocForRepo._key
                                    }
                                ),
                                hasAst: astTreeExists
                            }
                        )
                        """
        );
    }

    @Bean
    public EntityQuery<FullAstNodeModel> astNodeEntityQuery() {
        return new EntityQuery<>(
                "ast_nodes",
                FullAstNodeModel.class,
                "FOR entity IN ast_nodes",
                """
                        LET treeDoc = DOCUMENT(entity.tree)
                        LET parentNode = FIRST(
                            FOR p_node IN 1..1 INBOUND entity._id ast_parents
                                LIMIT 1
                                RETURN p_node
                        )
                        LET children = (
                            FOR c_node IN 1..1 OUTBOUND entity._id ast_parents
                                RETURN c_node._key
                        )
                        LET childrenCount = LENGTH(children)
                        """,
                """
                        MERGE(
                            entity,
                            {
                                id: entity._key,
                                arangoId: entity._id,
                                tree: treeDoc._key
                            },
                            {
                                parent: parentNode == null ? null : parentNode._key,
                                children: children,
                                childrenCount: childrenCount
                            }
                        )
                        """
        );
    }
}

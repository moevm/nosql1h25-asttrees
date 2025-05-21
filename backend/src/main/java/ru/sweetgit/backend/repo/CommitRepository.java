package ru.sweetgit.backend.repo;

import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.CommitModel;
import ru.sweetgit.backend.model.FullCommitModel;

import java.util.Collection;

public interface CommitRepository extends ArangoRepository<CommitModel, String> {
    @Query("""
        FOR c IN #{#collection}
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

             LET filesWithAstCount = COUNT(
                 FOR fileId IN c.rootFiles
                     LET commitFileDoc = DOCUMENT(fileId)
                     FILTER commitFileDoc != null AND DOCUMENT(CONCAT("ast_trees/", commitFileDoc.hash)) != null
                     RETURN 1
             )

             RETURN MERGE(
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
                     fileCount: LENGTH(c.rootFiles),
                     fileWithAstCount: filesWithAstCount
                 }
             )
        """)
    Collection<FullCommitModel> findAllFull();
}

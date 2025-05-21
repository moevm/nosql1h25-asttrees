package ru.sweetgit.backend.repo;

import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.domain.Sort;
import ru.sweetgit.backend.model.BranchModel;
import ru.sweetgit.backend.model.FullBranchModel;

import java.util.Collection;
import java.util.Optional;

public interface BranchRepository extends ArangoRepository<BranchModel, String> {
    Optional<BranchModel> findFirstByRepositoryId(String id, Sort sort);

    @Query("""
        FOR b IN #{#collection}
            LET repoDoc = DOCUMENT(b.repository)
            LET commitsForThisBranch = (
                FOR commitNode IN 1..1 OUTBOUND b._id branch_commits
                    RETURN 1
            )
            RETURN MERGE(
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
        """)
    Collection<FullBranchModel> findAllFull();
}

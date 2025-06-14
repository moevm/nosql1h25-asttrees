package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.BranchCommitModel;

public interface BranchCommitRepository extends ArangoRepository<BranchCommitModel, String> {
    public void deleteAllByCommitId(String commitId);
    public void deleteAllByBranchId(String branchId);
}

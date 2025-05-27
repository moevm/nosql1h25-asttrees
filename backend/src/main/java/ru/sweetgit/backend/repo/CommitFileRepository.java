package ru.sweetgit.backend.repo;


import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.CommitFileModel;

import java.util.Collection;
import java.util.Optional;

public interface CommitFileRepository extends ArangoRepository<CommitFileModel, String> {
    Optional<CommitFileModel> findByCommitIdAndFullPath(String commitId, String fullPath);

    Collection<CommitFileModel> findAllByParentId(String parentId);
}

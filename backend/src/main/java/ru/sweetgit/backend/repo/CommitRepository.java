package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.CommitModel;

public interface CommitRepository extends ArangoRepository<CommitModel, String> {
}

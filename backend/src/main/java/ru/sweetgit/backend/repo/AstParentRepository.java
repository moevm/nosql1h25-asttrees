package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.AstParentModel;

public interface AstParentRepository extends ArangoRepository<AstParentModel, String> {
    void deleteAllByFromId(String fromId);
}

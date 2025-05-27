package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.AstNodeModel;

public interface AstNodeRepository extends ArangoRepository<AstNodeModel, String> {
}

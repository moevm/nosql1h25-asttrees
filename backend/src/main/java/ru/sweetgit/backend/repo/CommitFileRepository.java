package ru.sweetgit.backend.repo;


import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.CommitFileModel;

public interface CommitFileRepository extends ArangoRepository<CommitFileModel, String> {

}

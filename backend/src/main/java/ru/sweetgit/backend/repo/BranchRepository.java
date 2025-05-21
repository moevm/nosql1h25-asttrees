package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import org.springframework.data.domain.Sort;
import ru.sweetgit.backend.model.BranchModel;

import java.util.Optional;

public interface BranchRepository extends ArangoRepository<BranchModel, String> {
    Optional<BranchModel> findFirstByRepositoryId(String id, Sort sort);
}

package ru.sweetgit.backend.repo;

import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.UserModel;

import java.util.Optional;


public interface UserRepository extends ArangoRepository<UserModel, String> {
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findByEmail(String email);
}

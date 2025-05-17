package ru.sweetgit.backend.repo;

import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import ru.sweetgit.backend.model.FullUserModel;
import ru.sweetgit.backend.model.UserModel;

import java.util.Collection;
import java.util.Optional;


public interface UserRepository extends ArangoRepository<UserModel, String> {
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findByEmail(String email);

    @Query("""
        FOR u IN #{#collection}
            LET repoCount = LENGTH(
            FOR r IN repositories
                FILTER r.owner == u._id
                RETURN 1
            )
            RETURN MERGE(
                u,
                {
                 id: u._key,
                 arangoId: u._id,
                 repositoryCount: repoCount
                }
            )
        """)
    Collection<FullUserModel> findAllFull();
}

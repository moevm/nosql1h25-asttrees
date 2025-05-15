package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.response.RepositoryDto;
import ru.sweetgit.backend.service.UserService;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserRepositoryController {
    private final UserService userService;

    @GetMapping("/users/{userId}/repositories")
    ResponseEntity<List<RepositoryDto>> getRepositories(
            @PathVariable("userId") String userId,
            @Nullable UserDetailsWithId currentUser
    ) {
        var maybeUser = userService.getUserById(userId);
        if (maybeUser.isEmpty()) {
            throw ApiException.notFound("user", "id", userId).build();
        }
        var user = maybeUser.get();
        userService.requireUserVisible(user, currentUser);

        // TODO
        return ResponseEntity.ok(List.of(
                new RepositoryDto(
                        "1",
                        "repo1",
                        userId,
                        "master",
                        URI.create("https://hello.world"),
                        OffsetDateTime.now()
                ),
                new RepositoryDto(
                        "2",
                        "repo2",
                        userId,
                        "main",
                        URI.create("https://hello.world"),
                        OffsetDateTime.now()
                )
        ));
    }
}

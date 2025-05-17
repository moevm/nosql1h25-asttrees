package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.sweetgit.backend.annotation.IsAuthenticated;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.dto.response.RepositoryDto;
import ru.sweetgit.backend.dto.response.RepositoryViewDto;
import ru.sweetgit.backend.mapper.RepositoryMapper;
import ru.sweetgit.backend.mapper.RepositoryViewMapper;
import ru.sweetgit.backend.service.RepositoryService;
import ru.sweetgit.backend.service.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RepositoryController {
    private final UserService userService;
    private final RepositoryService repositoryService;
    private final RepositoryMapper repositoryMapper;
    private final RepositoryViewMapper repositoryViewMapper;

    @GetMapping("/users/{userId}/repositories")
    ResponseEntity<List<RepositoryDto>> getRepositories(
            @PathVariable("userId") String userId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var user = userService.getUserById(userId)
                .orElseThrow(() -> ApiException.notFound("Пользователь", "id", userId).build());
        userService.requireUserVisible(user, currentUser);

        return ResponseEntity.ok(
                repositoryService.getRepositoriesForUser(user)
                        .stream()
                        .map(repositoryMapper::toRepositoryDto)
                        .toList()
        );
    }

    @PostMapping("/repositories")
    @IsAuthenticated
    ResponseEntity<RepositoryViewDto> createRepository(
            @Valid @RequestBody CreateRepositoryRequest request,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var result = repositoryService.createRepository(currentUser, request);
        return ResponseEntity.ok(repositoryViewMapper.toRepositoryViewModel(result));
    }

    @PatchMapping("/repositories/{repoId}")
    @IsAuthenticated
    ResponseEntity<RepositoryDto> updateRepository(
            @PathVariable("repoId") String repoId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        throw ApiException.badRequest().message("unimplemented").build();
    }

    @GetMapping("/repositories/{repoId}/branches/{branchId}/commits/{commitHash}/view")
    ResponseEntity<RepositoryViewDto> viewRepository(
            @PathVariable("repoId") String repoId,
            @PathVariable("branchId") String branchId,
            @PathVariable("commitHash") String commitHash,
            @RequestParam(value = "path", required = false) @Nullable String path,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var repo = repositoryService.getById(repoId)
                .orElseThrow(() -> ApiException.notFound("Репозиторий", "id", repoId).build());

        repositoryService.requireRepositoryVisible(repo, currentUser);


        var res = repositoryService.viewRepository(
                repoId,
                branchId,
                commitHash,
                path
        );

        return ResponseEntity.ok(repositoryViewMapper.toRepositoryViewModel(res));
    }

}

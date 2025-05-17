package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.response.CommitDto;
import ru.sweetgit.backend.mapper.CommitMapper;
import ru.sweetgit.backend.model.CommitModel;
import ru.sweetgit.backend.service.BranchService;
import ru.sweetgit.backend.service.RepositoryService;

import java.util.Comparator;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommitController {
    private final RepositoryService repositoryService;
    private final BranchService branchService;
    private final CommitMapper commitMapper;

    @GetMapping("/repositories/{repoId}/branches/{branchId}/commits")
    public ResponseEntity<List<CommitDto>> getBranchCommits(
            @PathVariable("repoId") String repoId,
            @PathVariable("branchId") String branchId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var repo = repositoryService.getById(repoId)
                .orElseThrow(() -> ApiException.notFound("Репозиторий", "id", repoId).build());

        repositoryService.requireRepositoryVisible(repo, currentUser);

        var branch = branchService.getByRepoAndId(repo, branchId)
                .orElseThrow(() -> ApiException.notFound("Ветка", "id", branchId).build());

        // TODO возможно отдельный запрос + пагинация
        return ResponseEntity.ok(
                branch.getCommits()
                        .stream()
                        .sorted(Comparator.comparing(CommitModel::getCreatedAt).reversed())
                        .map(commitMapper::toCommitDto)
                        .toList()
        );
    }
}

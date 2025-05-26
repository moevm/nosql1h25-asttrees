package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.AstSearchFindReferencesRequest;
import ru.sweetgit.backend.dto.response.AstSearchResultDto;
import ru.sweetgit.backend.mapper.AstSearchMapper;
import ru.sweetgit.backend.service.AstSearchService;
import ru.sweetgit.backend.service.CommitService;
import ru.sweetgit.backend.service.RepositoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AstSearchController {
    private final RepositoryService repositoryService;
    private final CommitService commitService;
    private final AstSearchService astSearchService;
    private final AstSearchMapper mapper;

    @PostMapping("/commits/{commitId}/ast/search")
    ResponseEntity<List<AstSearchResultDto>> search(
            @PathVariable("commitId") String commitId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser,
            @RequestBody AstSearchFindReferencesRequest request
    ) {
        commitService.getById(commitId)
                .orElseThrow(() -> ApiException.notFound("Коммит", "id", commitId).build());
        var repo = repositoryService.getByCommitId(commitId)
                .orElseThrow(() -> ApiException.notFound("Репозиторий", "id коммита", commitId).build());

        repositoryService.requireRepositoryVisible(repo, currentUser);

        var result = astSearchService.findReferences(
                commitId,
                request
        );

        return ResponseEntity.ok(
                result.stream()
                        .map(mapper::toAstSearchResultDto)
                        .toList()
        );
    }

}

package ru.sweetgit.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.dto.response.*;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;

@RestController
public class RepositoryController {
    @PostMapping("/repositories")
    ResponseEntity<RepositoryDto> createRepository(@Valid @RequestBody CreateRepositoryRequest request) {
        throw ApiException.badRequest().message("unimplemented").build();
    }

    @PatchMapping("/repositories/{repoId}")
    ResponseEntity<RepositoryDto> updateRepository(@PathVariable("repoId") String repoId) {
        throw ApiException.badRequest().message("unimplemented").build();
    }

    @GetMapping("/repositories/{repoId}/branches/{branchId}/commits/{commitId}/view")
    ResponseEntity<RepositoryViewDto> viewRepository(
            @PathVariable("repoId") String repoId,
            @PathVariable("branchId") String branchId,
            @PathVariable("commitId") String commitId
    ) {
        return ResponseEntity.ok(new RepositoryViewDto(
                new ShortUserDto("1", "user1"),
                new RepositoryDto(
                        repoId,
                        "repo",
                        "1",
                        "main",
                        URI.create("https://hello.world"),
                        OffsetDateTime.now()
                ),
                List.of("main", "dev"),
                new BranchDto(
                        branchId,
                        "main",
                        repoId,
                        true,
                        OffsetDateTime.now()
                ),
                new CommitDto(
                        commitId,
                        branchId,
                        "test hash",
                        "max",
                        "max@email.com",
                        "initial commit",
                        3,
                        10,
                        0,
                        OffsetDateTime.now(),
                        List.of(
                                new CommitFileDto(
                                        "1",
                                        "README.md",
                                        FileTypeDto.FILE,
                                        "test hash",
                                        commitId,
                                        null
                                ),
                                new CommitFileDto(
                                        "1",
                                        "README.md",
                                        FileTypeDto.DIRECTORY,
                                        "test hash",
                                        commitId,
                                        null
                                )
                        )
                )
        ));
    }

}

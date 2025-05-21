package ru.sweetgit.backend.dto.response;

import java.time.Instant;

public record EntityCommitDto(
        String id,
        String hash,
        String author,
        String email,
        String message,
        int filesChanged,
        int linesAdded,
        int linesRemoved,
        RepositoryWithOwnerDetailsDto repository,
        int branchCount,
        int fileCount,
        int fileWithAstCount,
        Instant createdAt
) {
}

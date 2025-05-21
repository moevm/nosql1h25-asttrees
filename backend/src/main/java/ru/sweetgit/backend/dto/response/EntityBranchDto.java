package ru.sweetgit.backend.dto.response;

import java.time.Instant;

public record EntityBranchDto(
        String id,
        String name,
        RepositoryWithOwnerDetailsDto repository,
        boolean isDefault,
        Instant createdAt,
        int commitCount
) {
}

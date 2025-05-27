package ru.sweetgit.backend.dto.response;

import java.time.Instant;
import java.util.List;

public record EntityBranchDto(
        String id,
        String name,
        RepositoryWithOwnerDetailsDto repository,
        boolean isDefault,
        Instant createdAt,
        List<String> commits,
        int commitCount
) {
}

package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record BranchDto(
        String id,
        String name,
        String repo,
        boolean isDefault,
        OffsetDateTime createdAt
) {
}

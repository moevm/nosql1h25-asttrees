package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record BranchDto(
        String id,
        String name,
        boolean isDefault,
        OffsetDateTime createdAt
) {
}

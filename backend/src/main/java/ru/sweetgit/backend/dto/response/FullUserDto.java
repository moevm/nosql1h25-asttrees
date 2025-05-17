package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record FullUserDto(
        String id,
        String username,
        String email,
        UserVisibilityDto visibility,
        OffsetDateTime createdAt,
        boolean isAdmin,
        int repositoryCount
) {
}

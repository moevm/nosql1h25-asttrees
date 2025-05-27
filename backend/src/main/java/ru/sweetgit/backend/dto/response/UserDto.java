package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record UserDto (
        String id,
        String username,
        String email,
        UserVisibilityDto visibility,
        OffsetDateTime createdAt,
        boolean isAdmin
) {
}

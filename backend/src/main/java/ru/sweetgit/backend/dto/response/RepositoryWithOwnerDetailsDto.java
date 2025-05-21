package ru.sweetgit.backend.dto.response;

import java.net.URI;
import java.time.OffsetDateTime;

public record RepositoryWithOwnerDetailsDto(
        String id,
        String name,
        ShortUserDto owner,
        URI originalLink,
        RepositoryVisibilityDto visibility,
        OffsetDateTime createdAt
) {
}

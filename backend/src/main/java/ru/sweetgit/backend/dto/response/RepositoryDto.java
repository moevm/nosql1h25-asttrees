package ru.sweetgit.backend.dto.response;

import java.net.URI;
import java.time.OffsetDateTime;

public record RepositoryDto(
        String id,
        String name,
        String owner,
        URI originalLink,
        RepositoryVisibilityDto visibility,
        OffsetDateTime createdAt
) {
}

package ru.sweetgit.backend.dto.response;

import java.net.URI;
import java.time.Instant;

public record EntityRepositoryDto(
        String id,
        String name,
        ShortUserDto owner,
        URI originalLink,
        RepositoryVisibilityDto visibility,
        Instant createdAt,
        int branchCount,
        int commitCount
) {
}

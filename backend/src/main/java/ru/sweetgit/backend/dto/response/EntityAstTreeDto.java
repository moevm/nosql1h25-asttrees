package ru.sweetgit.backend.dto.response;

import java.time.Instant;

public record EntityAstTreeDto(
        String id,
        Instant createdAt,
        int depth,
        int size,
        ShortCommitFileDto commitFile
)  {
}

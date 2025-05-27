package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record CommitDto(
        String id,
        String hash,
        String author,
        String email,
        String message,
        int filesChanged,
        int linesAdded,
        int linesRemoved,
        OffsetDateTime createdAt
) {
}

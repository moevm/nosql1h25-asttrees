package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.List;

public record CommitDto(
        String id,
        String branch,
        String hash,
        String author,
        String email,
        String message,
        int filesChanged,
        int linesAdded,
        int linesRemoved,
        OffsetDateTime createdAt,
        List<CommitFileDto> rootFiles
) {
}

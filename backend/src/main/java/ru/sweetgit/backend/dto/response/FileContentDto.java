package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

public record FileContentDto(
        CommitFileDto commitFile,
        boolean isBinary,
        @Nullable String content,
        int lines,
        long bytes,
        boolean hasAst
) {
}

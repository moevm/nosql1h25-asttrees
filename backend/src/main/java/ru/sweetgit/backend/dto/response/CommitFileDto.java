package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

public record CommitFileDto(
        String id,
        String name,
        String fullPath,
        FileTypeDto type,
        String hash,
        String commit,
        @Nullable
        String parent
) {
}

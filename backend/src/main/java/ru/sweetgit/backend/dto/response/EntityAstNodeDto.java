package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

public record EntityAstNodeDto(
        String id,
        String label,
        String type,
        String tree,
        @Nullable String parent,
        long childrenCount
//        ShortCommitFileDto commitFile
) {
}

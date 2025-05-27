package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

import java.util.List;

public record EntityAstNodeDto(
        String id,
        String label,
        String type,
        String tree,
        @Nullable String parent,
        List<String> children,
        long childrenCount
//        ShortCommitFileDto commitFile
) {
}

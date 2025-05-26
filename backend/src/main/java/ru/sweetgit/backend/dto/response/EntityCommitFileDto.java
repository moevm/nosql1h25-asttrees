package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

public record EntityCommitFileDto(
        String id,
        String name,
        String fullPath,
        FileTypeDto type,
        @Nullable String hash,
        @Nullable String parent,
        CommitDto commit,
        RepositoryDto repository,
        boolean hasAst
) {
}

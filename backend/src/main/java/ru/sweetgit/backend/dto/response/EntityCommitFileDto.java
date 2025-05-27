package ru.sweetgit.backend.dto.response;

import jakarta.annotation.Nullable;

import java.util.List;

public record EntityCommitFileDto(
        String id,
        String name,
        String fullPath,
        FileTypeDto type,
        @Nullable String hash,
        @Nullable String parent,
        CommitDto commit,
        RepositoryDto repository,
        boolean hasAst,
        int branchCount,
        List<String> branches,
        String originalAuthor,
        String lastChangedBy
) {
}

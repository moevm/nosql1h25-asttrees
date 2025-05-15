package ru.sweetgit.backend.dto.response;

import java.util.List;

public record RepositoryViewDto(
        ShortUserDto owner,
        RepositoryDto repository,
        List<String> branches,
        BranchDto branch,
        CommitDto commit
) {
}

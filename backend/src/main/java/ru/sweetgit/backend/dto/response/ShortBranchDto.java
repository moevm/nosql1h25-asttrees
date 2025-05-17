package ru.sweetgit.backend.dto.response;

public record ShortBranchDto(
        String id,
        String name,
        boolean isDefault
) {
}

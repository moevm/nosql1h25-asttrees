package ru.sweetgit.backend.dto.response;

public record ShortCommitFileDto(
        String id,
        String name,
        FileTypeDto type,
        String hash
) {
}

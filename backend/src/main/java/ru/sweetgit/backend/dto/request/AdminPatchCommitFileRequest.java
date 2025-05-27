package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.annotation.NullOrNotBlank;

public record AdminPatchCommitFileRequest(
        @NotNull @NotBlank String name,
        @NotNull @NotBlank String fullPath,
        @NullOrNotBlank String hash,
        @NullOrNotBlank String parent,
        @NotNull @NotBlank String commit,
        @NotNull @NotBlank String originalAuthor,
        @NotNull @NotBlank String lastChangedBy
) {
}

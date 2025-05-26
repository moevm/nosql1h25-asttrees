package ru.sweetgit.backend.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import ru.sweetgit.backend.annotation.NullOrNotBlank;
import ru.sweetgit.backend.dto.response.FileTypeDto;

import java.time.OffsetDateTime;

public record AdminPatchCommitFileRequest(
        @NotNull @NotBlank String name,
        @NotNull @NotBlank String fullPath,
        @NullOrNotBlank String hash,
        @NullOrNotBlank String parent,
        @NotNull @NotBlank String commit
) {
}

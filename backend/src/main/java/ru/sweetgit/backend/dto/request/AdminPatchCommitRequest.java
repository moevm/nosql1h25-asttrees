package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.OffsetDateTime;

public record AdminPatchCommitRequest(
        @NotNull @NotBlank String hash,
        @NotNull @NotBlank String author,
        @NotNull @NotBlank String email,
        @NotNull @NotBlank String message,
        @PositiveOrZero int filesChanged,
        @PositiveOrZero int linesAdded,
        @PositiveOrZero int linesRemoved,
        @NotNull OffsetDateTime createdAt
) {
}

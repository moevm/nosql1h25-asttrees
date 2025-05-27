package ru.sweetgit.backend.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record AdminPatchAstNodeRequest(
        @NotNull String type,
        @NotNull String label,
        @NotNull @NotBlank String tree
) {
}

package ru.sweetgit.backend.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.dto.response.FileTypeDto;

import java.time.OffsetDateTime;

public record AdminPatchAstTreeRequest(
        @NotNull OffsetDateTime createdAt
) {
}

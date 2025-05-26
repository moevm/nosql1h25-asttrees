package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.dto.response.RepositoryVisibilityDto;

import java.net.URI;
import java.time.OffsetDateTime;

public record AdminPatchBranchRequest(
        @NotNull @NotBlank String name,
        @NotNull @NotBlank String repository,
        @NotNull OffsetDateTime createdAt,
        boolean isDefault
) {
}

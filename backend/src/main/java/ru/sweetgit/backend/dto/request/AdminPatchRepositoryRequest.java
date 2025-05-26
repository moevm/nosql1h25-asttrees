package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.dto.response.RepositoryVisibilityDto;
import ru.sweetgit.backend.dto.response.UserVisibilityDto;

import java.net.URI;
import java.time.OffsetDateTime;

public record AdminPatchRepositoryRequest(
        @NotNull @NotBlank String name,
        @NotNull @NotBlank String owner,
        @NotNull RepositoryVisibilityDto visibility,
        @NotNull OffsetDateTime createdAt,
        @NotNull URI originalLink
) {
}

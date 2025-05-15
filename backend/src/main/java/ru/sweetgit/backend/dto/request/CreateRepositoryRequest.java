package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.dto.response.RepositoryVisibilityDto;

import java.net.URI;

public record CreateRepositoryRequest(
        @NotNull
        URI originalLink,
        @NotBlank
        String name,
        @NotNull
        RepositoryVisibilityDto visibility
) {
}

package ru.sweetgit.backend.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import ru.sweetgit.backend.dto.response.RepositoryVisibilityDto;

public record UpdateRepositoryRequest(
        @Nullable
        @NotBlank
        String name,
        @Nullable
        RepositoryVisibilityDto visibility
) {
}

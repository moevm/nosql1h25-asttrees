package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.sweetgit.backend.dto.response.UserVisibilityDto;

import java.time.OffsetDateTime;

public record AdminPatchUserRequest(
        @NotNull @NotBlank String username,
        @NotNull @Email String email,
        @NotNull UserVisibilityDto visibility,
        @NotNull OffsetDateTime createdAt,
        boolean isAdmin
) {
}

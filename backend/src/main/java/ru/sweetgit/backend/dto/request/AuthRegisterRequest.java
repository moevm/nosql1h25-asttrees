package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AuthRegisterRequest(
        @NotNull
        @NotBlank
        String username,
        @NotNull
        @Email
        String email,
        @NotNull
        @NotBlank
        String password
) {
}

package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRegisterRequest(
        @NotBlank
        String username,
        @Email
        String email,
        @NotBlank
        String password
) {
}

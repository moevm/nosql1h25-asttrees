package ru.sweetgit.backend.dto.request;

import jakarta.annotation.Nullable;
import ru.sweetgit.backend.dto.response.UserVisibilityDto;

public record UpdateCurrentUserRequest(
        @Nullable String oldPassword,
        @Nullable String newPassword,
        @Nullable UserVisibilityDto visibility
) {
}

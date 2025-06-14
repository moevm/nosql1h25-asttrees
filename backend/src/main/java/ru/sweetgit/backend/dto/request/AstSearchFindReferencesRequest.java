package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AstSearchFindReferencesRequest(
        @NotNull @NotBlank String typename,
        @NotNull List<String> types
) {
}

package ru.sweetgit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AdminSetLinksRequest(
        @NotNull List<@NotNull @NotBlank String> links
) {
}

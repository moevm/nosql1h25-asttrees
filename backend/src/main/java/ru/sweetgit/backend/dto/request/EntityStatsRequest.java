package ru.sweetgit.backend.dto.request;


import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record EntityStatsRequest(
        @Nullable String query,
        @NotNull List<@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String> searchFields,
        @NotNull List<EntitySearchRequest.Filter> filter,
        @NotNull @Pattern(regexp = "^[a-zA-Z0-9_.]+$") String xAxisField,
        @NotNull @Pattern(regexp = "^[a-zA-Z0-9_.]+$") String yAxisField
) {
}

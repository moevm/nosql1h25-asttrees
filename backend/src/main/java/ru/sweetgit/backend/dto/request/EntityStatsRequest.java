package ru.sweetgit.backend.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record EntityStatsRequest(
        @NotNull List<EntitySearchRequest.Filter> filter,
        @NotNull @Pattern(regexp = "^[a-zA-Z0-9_.]+$") String xAxisField,
        @NotNull @Pattern(regexp = "^[a-zA-Z0-9_.]+$") String yAxisField
) {
}

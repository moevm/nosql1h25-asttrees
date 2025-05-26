package ru.sweetgit.backend.dto.request;


import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;

import java.util.List;
import java.util.Map;

public record EntitySearchRequest(
        @Nullable String query,
        @NotNull List<@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String> searchFields,
        @NotNull Pagination pagination,
        @NotNull List<SortOrder> sort,
        @NotNull List<Filter> filter
) {
    public record Pagination(@PositiveOrZero int pageIndex, @Positive int pageSize) {
    }

    public record SortOrder(@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String field, boolean asc) {
    }

    public record Filter(@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String field, @NotNull @NotBlank String kind, @NotNull Map<String, Object> params) {
    }
}

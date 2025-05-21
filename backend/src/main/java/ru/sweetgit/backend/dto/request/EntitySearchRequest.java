package ru.sweetgit.backend.dto.request;


import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;
import java.util.Map;

public record EntitySearchRequest(
        @Nullable String query,
        List<@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String> searchFields,
        Pagination pagination,
        List<SortOrder> sort,
        List<Filter> filter
) {
    public record Pagination(@PositiveOrZero int pageIndex, @Positive int pageSize) {
    }

    public record SortOrder(@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String field, boolean asc) {
    }

    public record Filter(@Pattern(regexp = "^[a-zA-Z0-9_.]+$") String field, String kind, Map<String, Object> params) {
    }
}

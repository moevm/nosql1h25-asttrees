package ru.sweetgit.backend.dto.response;

import java.util.List;

public record EntityStatsDto(
        List<Item> items
) {
    public record Item(
            Object xValue,
            Object yValue,
            long count
    ) {}
}

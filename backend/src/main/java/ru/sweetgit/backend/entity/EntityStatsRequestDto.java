package ru.sweetgit.backend.entity;

import jakarta.annotation.Nullable;

public record EntityStatsRequestDto(
        EntitySearchDto search,
        String xAxisField,
        @Nullable String yAxisField
) {
}

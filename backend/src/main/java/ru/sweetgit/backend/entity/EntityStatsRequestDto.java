package ru.sweetgit.backend.entity;

public record EntityStatsRequestDto(
        EntitySearchDto search,
        String xAxisField,
        String yAxisField
) {
}

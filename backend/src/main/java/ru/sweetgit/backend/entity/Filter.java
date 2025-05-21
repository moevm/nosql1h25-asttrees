package ru.sweetgit.backend.entity;

import java.util.Map;

public record Filter(
        FilterKind kind,
        String fieldName,
        Map<String, Object> parameters
) {
}

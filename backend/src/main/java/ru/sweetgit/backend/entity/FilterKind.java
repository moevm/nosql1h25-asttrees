package ru.sweetgit.backend.entity;

import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Map;
import java.util.function.Function;

public record FilterKind(
        String name,
        Map<String, TypeReference<?>> parameters,
        Builder builder
) {
    @FunctionalInterface
    public interface Builder {
        String build(
                String fieldName,
                Map<String, Object> parameters,
                Function<Object, String> varBinder
        );
    }
}

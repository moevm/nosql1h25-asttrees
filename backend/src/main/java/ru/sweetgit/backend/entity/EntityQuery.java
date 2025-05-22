package ru.sweetgit.backend.entity;

public record EntityQuery<T>(
        String name,
        Class<T> resultClass,
        String collectionPart,
        String selectPart,
        String mergePart
) {
}

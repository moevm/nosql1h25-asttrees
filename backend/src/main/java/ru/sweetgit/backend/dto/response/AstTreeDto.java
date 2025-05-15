package ru.sweetgit.backend.dto.response;

import java.time.OffsetDateTime;

public record AstTreeDto(
        String id,
        OffsetDateTime createdAt,
        AstNodeDto rootNode
){
}

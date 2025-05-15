package ru.sweetgit.backend.dto.response;

import java.util.List;

public record AstNodeDto(
        String id,
        String label,
        String type,
        List<AstNodeDto> children
) {
}

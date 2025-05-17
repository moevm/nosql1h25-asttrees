package ru.sweetgit.backend.dto.response;

import java.util.List;

public record AstTreeViewDto(
        int depth,
        List<AstNodeDto> nodes
) {
}

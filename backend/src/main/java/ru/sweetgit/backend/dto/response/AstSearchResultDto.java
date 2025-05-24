package ru.sweetgit.backend.dto.response;

import java.util.List;

public record AstSearchResultDto(
        CommitFileDto file,
        List<AstNodeDto> nodes
) {
}

package ru.sweetgit.backend.entity;


import org.springframework.data.domain.Pageable;

import java.util.List;

public record EntitySearchDto(
        String query,
        List<String> searchFields,
        Pageable pageable,
        List<Filter> filter
) {
}

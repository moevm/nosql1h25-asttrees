package ru.sweetgit.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.request.EntitySearchRequest;
import ru.sweetgit.backend.dto.response.EntityBranchDto;
import ru.sweetgit.backend.dto.response.EntityCommitDto;
import ru.sweetgit.backend.dto.response.EntityRepositoryDto;
import ru.sweetgit.backend.dto.response.EntityUserDto;
import ru.sweetgit.backend.entity.EntitySearchDto;
import ru.sweetgit.backend.entity.Filter;
import ru.sweetgit.backend.entity.FilterKind;
import ru.sweetgit.backend.mapper.EntityMapper;
import ru.sweetgit.backend.service.EntityService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
//    @IsAdmin TODO
public class EntityController {
    private final EntityService entityService;
    private final EntityMapper entityMapper;
    private final ObjectMapper objectMapper;
    @Qualifier("entityFilterMap")
    private final Map<String, FilterKind> filterKindMap;

    @PostMapping("/entities/users")
    public ResponseEntity<Page<EntityUserDto>> queryUsers(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getUserEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/repositories")
    public ResponseEntity<Page<EntityRepositoryDto>> querytRepositories(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getRepositoryEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/branches")
    public ResponseEntity<Page<EntityBranchDto>> queryBranches(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getBranchEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/commits")
    public ResponseEntity<Page<EntityCommitDto>> queryCommits(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getCommitEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    private EntitySearchDto convert(EntitySearchRequest request) {
        return new EntitySearchDto(
                request.query(),
                request.searchFields(),
                PageRequest.of(
                        request.pagination().pageIndex(),
                        request.pagination().pageSize(),
                        Sort.by(
                                request.sort().stream().map(order -> new Sort.Order(
                                        order.asc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                                        order.field()
                                )).toList()
                        )
                ),
                request.filter().stream().map(this::convert).toList()
        );
    }

    private Filter convert(EntitySearchRequest.Filter filter) {
        var kind = filterKindMap.get(filter.kind());
        if (kind == null) {
            throw ApiException.badRequest().message("Фильтр не найден: " + filter.kind()).build();
        }

        var params = new HashMap<String, Object>();
        kind.parameters().forEach((name, ref) -> {
            if (!filter.params().containsKey(name)) {
                throw ApiException.badRequest().message("Не указан параметр %s для фильтра %s %s".formatted(name, filter.kind(), filter.field())).build();
            }

            Object result;
            try {
                result = objectMapper.convertValue(
                        filter.params().get(name),
                        ref
                );
            } catch (IllegalArgumentException e) {
                throw ApiException.badRequest().message("Неверный тип параметра %s для фильтра %s %s: ожидался %s".formatted(name, filter.kind(), filter.field(), ref)).build();
            }

            if (result == null) {
                throw ApiException.badRequest().message("Не указан параметр %s для фильтра %s %s".formatted(name, filter.kind(), filter.field())).build();
            }

            params.put(name, result);
        });

        return new Filter(
                kind,
                filter.field(),
                params
        );
    }
}

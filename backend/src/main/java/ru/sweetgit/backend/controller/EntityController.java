package ru.sweetgit.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.request.EntitySearchRequest;
import ru.sweetgit.backend.dto.request.EntityStatsRequest;
import ru.sweetgit.backend.dto.response.*;
import ru.sweetgit.backend.entity.EntitySearchDto;
import ru.sweetgit.backend.entity.EntityStatsRequestDto;
import ru.sweetgit.backend.entity.Filter;
import ru.sweetgit.backend.entity.FilterKind;
import ru.sweetgit.backend.mapper.EntityMapper;
import ru.sweetgit.backend.service.EntityService;

import java.util.HashMap;
import java.util.List;
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

    @PostMapping("/entities/users/query")
    public ResponseEntity<Page<EntityUserDto>> queryUsers(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getUserEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/users/stats")
    public ResponseEntity<EntityStatsDto> statsUsers(
            @Valid @RequestBody EntityStatsRequest request
    ) {
        var searchDto = convert(request);
        var result = entityService.getUserEntityStats(searchDto);
        return ResponseEntity.ok(entityMapper.toEntityDto(result));
    }

    @GetMapping("/entities/users/{userId}")
    public ResponseEntity<EntityUserDto> getUser(
            @PathVariable String userId
    ) {
        var searchDto = queryById(userId);
        var page = entityService.getUserEntities(searchDto);

        var entity = page.stream().findFirst()
                .orElseThrow(() -> ApiException.notFound("Пользователь", "id", userId).build());

        return ResponseEntity.ok(entityMapper.toEntityDto(entity));
    }

    @PostMapping("/entities/repositories/query")
    public ResponseEntity<Page<EntityRepositoryDto>> queryRepositories(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getRepositoryEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/repositories/stats")
    public ResponseEntity<EntityStatsDto> statsRepositories(
            @Valid @RequestBody EntityStatsRequest request
    ) {
        var searchDto = convert(request);
        var result = entityService.getRepositoryEntityStats(searchDto);
        return ResponseEntity.ok(entityMapper.toEntityDto(result));
    }

    @GetMapping("/entities/repositories/{repositoryId}")
    public ResponseEntity<EntityRepositoryDto> getRepository(
            @PathVariable String repositoryId
    ) {
        var searchDto = queryById(repositoryId);
        var page = entityService.getRepositoryEntities(searchDto);

        var entity = page.stream().findFirst()
                .orElseThrow(() -> ApiException.notFound("Репозиторий", "id", repositoryId).build());

        return ResponseEntity.ok(entityMapper.toEntityDto(entity));
    }

    @PostMapping("/entities/branches/query")
    public ResponseEntity<Page<EntityBranchDto>> queryBranches(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getBranchEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }

    @PostMapping("/entities/branches/stats")
    public ResponseEntity<EntityStatsDto> statsBranches(
            @Valid @RequestBody EntityStatsRequest request
    ) {
        var searchDto = convert(request);
        var result = entityService.getBranchEntityStats(searchDto);
        return ResponseEntity.ok(entityMapper.toEntityDto(result));
    }

    @GetMapping("/entities/branches/{branchId}")
    public ResponseEntity<EntityBranchDto> getBranch(
            @PathVariable String branchId
    ) {
        var searchDto = queryById(branchId);
        var page = entityService.getBranchEntities(searchDto);

        var entity = page.stream().findFirst()
                .orElseThrow(() -> ApiException.notFound("Ветка", "id", branchId).build());

        return ResponseEntity.ok(entityMapper.toEntityDto(entity));
    }

    @PostMapping("/entities/commits/query")
    public ResponseEntity<Page<EntityCommitDto>> queryCommits(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getCommitEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }


    @PostMapping("/entities/commits/stats")
    public ResponseEntity<EntityStatsDto> statsCommits(
            @Valid @RequestBody EntityStatsRequest request
    ) {
        var searchDto = convert(request);
        var result = entityService.getCommitEntityStats(searchDto);
        return ResponseEntity.ok(entityMapper.toEntityDto(result));
    }

    @GetMapping("/entities/commits/{commitId}")
    public ResponseEntity<EntityCommitDto> getCommit(
            @PathVariable String commitId
    ) {
        var searchDto = queryById(commitId);
        var page = entityService.getCommitEntities(searchDto);

        var entity = page.stream().findFirst()
                .orElseThrow(() -> ApiException.notFound("Коммит", "id", commitId).build());

        return ResponseEntity.ok(entityMapper.toEntityDto(entity));
    }


    @PostMapping("/entities/ast_trees/query")
    public ResponseEntity<Page<EntityAstTreeDto>> queryAstTrees(
            @Valid @RequestBody EntitySearchRequest request
    ) {
        var searchDto = convert(request);
        var page = entityService.getAstTreeEntities(searchDto);
        return ResponseEntity.ok(page.map(entityMapper::toEntityDto));
    }


    @PostMapping("/entities/ast_trees/stats")
    public ResponseEntity<EntityStatsDto> statsAstTrees(
            @Valid @RequestBody EntityStatsRequest request
    ) {
        var searchDto = convert(request);
        var result = entityService.getAstTreeEntityStats(searchDto);
        return ResponseEntity.ok(entityMapper.toEntityDto(result));
    }

    @GetMapping("/entities/ast_trees/{astTreeId}")
    public ResponseEntity<EntityAstTreeDto> getAstTree(
            @PathVariable String astTreeId
    ) {
        var searchDto = queryById(astTreeId);
        var page = entityService.getAstTreeEntities(searchDto);

        var entity = page.stream().findFirst()
                .orElseThrow(() -> ApiException.notFound("AST-дерево", "хэш", astTreeId).build());

        return ResponseEntity.ok(entityMapper.toEntityDto(entity));
    }

    private EntitySearchDto queryById(String id) {
        return new EntitySearchDto(
                "",
                List.of(),
                PageRequest.of(0, 1),
                List.of(),
                id
        );
    }

    private EntityStatsRequestDto convert(EntityStatsRequest request) {
        return new EntityStatsRequestDto(
                new EntitySearchDto(
                        "",
                        List.of(),
                        Pageable.unpaged(),
                        request.filter().stream().map(this::convert).toList(),
                        null
                ),
                request.xAxisField(),
                request.yAxisField()
        );
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
                request.filter().stream().map(this::convert).toList(),
                null
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

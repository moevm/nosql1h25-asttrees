package ru.sweetgit.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.util.StreamUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.response.EntityBranchDto;
import ru.sweetgit.backend.dto.response.EntityRepositoryDto;
import ru.sweetgit.backend.dto.response.EntityUserDto;
import ru.sweetgit.backend.mapper.EntityMapper;
import ru.sweetgit.backend.service.EntityService;

import java.util.List;

@RestController
@RequiredArgsConstructor
//    @IsAdmin TODO
public class EntityController {
    private final EntityService entityService;
    private final EntityMapper entityMapper;

    @GetMapping("/entities/users")
    public ResponseEntity<List<EntityUserDto>> getUsers() {
        return ResponseEntity.ok(
                StreamUtils.createStreamFromIterator(entityService.getUserEntities().iterator())
                        .map(entityMapper::toEntityDto)
                        .toList()
        );
    }

    @GetMapping("/entities/repositories")
    public ResponseEntity<List<EntityRepositoryDto>> getRepositories() {
        return ResponseEntity.ok(
                StreamUtils.createStreamFromIterator(entityService.getRepositoryEntities().iterator())
                        .map(entityMapper::toEntityDto)
                        .toList()
        );
    }

    @GetMapping("/entities/branches")
    public ResponseEntity<List<EntityBranchDto>> getBranches() {
        return ResponseEntity.ok(
                StreamUtils.createStreamFromIterator(entityService.getBranchEntities().iterator())
                        .map(entityMapper::toEntityDto)
                        .toList()
        );
    }
}

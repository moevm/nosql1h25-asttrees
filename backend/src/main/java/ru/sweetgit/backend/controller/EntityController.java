package ru.sweetgit.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.dto.response.UserDto;
import ru.sweetgit.backend.mapper.RepositoryMapper;
import ru.sweetgit.backend.mapper.UserMapper;
import ru.sweetgit.backend.service.RepositoryService;
import ru.sweetgit.backend.service.UserService;

import java.util.List;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
//    @IsAdmin TODO
public class EntityController {
    private final UserService userService;
    private final RepositoryService repositoryService;
    private final UserMapper userMapper;
    private final RepositoryMapper repositoryMapper;

    @GetMapping("/entities/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(
                StreamSupport.stream(userService.getAllUsers().spliterator(), false)
                        .map(userMapper::toUserDto)
                        .toList()
        );
    }

//    @GetMapping("/entities/repositories")
//    public ResponseEntity<List<RepositoryDto>> getRepositories() {
//        return ResponseEntity.ok(
//                StreamSupport.stream(userService.getAllUsers().spliterator(), false)
//                        .map(userMapper::toUserDto)
//                        .toList()
//        );
//    }
}

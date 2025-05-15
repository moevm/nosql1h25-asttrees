package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.sweetgit.backend.annotation.IsAuthenticated;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.AuthRegisterRequest;
import ru.sweetgit.backend.dto.response.UserDto;
import ru.sweetgit.backend.mapper.UserMapper;
import ru.sweetgit.backend.service.UserService;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/users/{userId}")
    ResponseEntity<UserDto> getUserInfo(
            @PathVariable("userId") String userId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var maybeUser = userService.getUserById(userId);
        if (maybeUser.isEmpty()) {
            throw ApiException.notFound("user", "id", userId).build();
        }
        var user = maybeUser.get();
        userService.requireUserVisible(user, currentUser);

        return ResponseEntity.ok(userMapper.map(user));
    }

    @GetMapping("/users/me")
    @IsAuthenticated
    ResponseEntity<UserDto> getCurrentUserInfo(
            @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        @SuppressWarnings("OptionalGetWithoutIsPresent")
        var user = userService.getUserById(currentUser.getId()).get();

        return ResponseEntity.ok(userMapper.map(user));
    }

    @PostMapping("/auth/register")
    ResponseEntity<UserDto> authRegister(@Valid @RequestBody AuthRegisterRequest request) {
        if (userService.getUserByUsername(request.username()).isPresent()) {
            throw ApiException.badRequest().message("username already exists").build();
        }
        if (userService.getUserByEmail(request.email()).isPresent()) {
            throw ApiException.badRequest().message("email already exists").build();
        }

        var userModel = userService.createUser(userMapper.map(request));
        return ResponseEntity.ok(userMapper.map(userModel));
    }
}

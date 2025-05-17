package ru.sweetgit.backend.controller;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.sweetgit.backend.annotation.IsAuthenticated;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.AuthLoginRequest;
import ru.sweetgit.backend.dto.request.AuthRegisterRequest;
import ru.sweetgit.backend.dto.response.LoginResponseDto;
import ru.sweetgit.backend.dto.response.UserDto;
import ru.sweetgit.backend.mapper.UserMapper;
import ru.sweetgit.backend.service.JwtService;
import ru.sweetgit.backend.service.UserService;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @GetMapping("/users/{userId}")
    ResponseEntity<UserDto> getUserInfo(
            @PathVariable("userId") String userId,
            @Nullable @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        var user = userService.getUserById(userId)
                .orElseThrow(() -> ApiException.notFound("Пользователь", "id", userId).build());

        userService.requireUserVisible(user, currentUser);

        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @GetMapping("/users/me")
    @IsAuthenticated
    ResponseEntity<UserDto> getCurrentUserInfo(
            @AuthenticationPrincipal UserDetailsWithId currentUser
    ) {
        @SuppressWarnings("OptionalGetWithoutIsPresent")
        var user = userService.getUserById(currentUser.getId()).get();

        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @PostMapping("/auth/register")
    ResponseEntity<UserDto> authRegister(@Valid @RequestBody AuthRegisterRequest request) {
        if (userService.getUserByUsername(request.username()).isPresent()) {
            throw ApiException.badRequest().message("Пользователь с таким именем уже существует").build();
        }
        if (userService.getUserByEmail(request.email()).isPresent()) {
            throw ApiException.badRequest().message("Пользователь с таким адресом почти уже существует").build();
        }

        var userModel = userService.createUser(userMapper.toUserModel(request));
        return ResponseEntity.ok(userMapper.toUserDto(userModel));
    }

    @PostMapping("/auth/login")
    ResponseEntity<LoginResponseDto> authLogin(@Valid @RequestBody AuthLoginRequest request) {
        var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
        ));

        var token = jwtService.generateToken(auth);
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}

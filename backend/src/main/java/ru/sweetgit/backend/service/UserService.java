package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.UpdateCurrentUserRequest;
import ru.sweetgit.backend.model.UserModel;
import ru.sweetgit.backend.model.UserVisibilityModel;
import ru.sweetgit.backend.repo.UserRepository;

import java.util.Optional;

import static ru.sweetgit.backend.service.UserDetailsServiceImpl.ROLE_ADMIN;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<UserModel> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<UserModel> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<UserModel> getUserByEmail(String id) {
        return userRepository.findByEmail(id);
    }

    public Iterable<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean isUserVisible(UserModel user, @Nullable UserDetailsWithId currentUser) {
        if (user.getVisibility().equals(UserVisibilityModel.PUBLIC)) {
            return true;
        }

        if (currentUser == null) {
            return false;
        }
        if (currentUser.getId().equals(user.getId())) {
            return true;
        }
        if (isAdmin(currentUser)) {
            return true;
        }
        return false;
    }

    public void requireUserVisible(UserModel user, @Nullable UserDetailsWithId currentUser) {
        if (!isUserVisible(user, currentUser)) {
            throw ApiException.forbidden().message("Нет прав для доступа к пользователю %s".formatted(user.getId())).build();
        }
    }

    public static boolean isAdmin(UserDetails userDetails) {
        return userDetails.getAuthorities().contains(new SimpleGrantedAuthority(ROLE_ADMIN));
    }

    public UserModel createUser(UserModel request) {
        return userRepository.save(request);
    }

    public UserModel updateUser(UserModel user, UpdateCurrentUserRequest request) {
        var builder = user.toBuilder();

        if (request.newPassword() != null) {
            if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
                throw ApiException.badRequest().message("Неверный пароль").build();
            }

            builder = builder.passwordHash(passwordEncoder.encode(request.newPassword()));
        }
        if (request.visibility() != null) {
            builder = builder.visibility(UserVisibilityModel.valueOf(request.visibility().name()));
        }

        return userRepository.save(builder.build());
    }
}

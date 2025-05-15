package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.model.UserModel;
import ru.sweetgit.backend.model.UserVisibilityModel;
import ru.sweetgit.backend.repo.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Optional<UserModel> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<UserModel> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<UserModel> getUserByEmail(String id) {
        return userRepository.findByEmail(id);
    }

    public boolean isUserVisible(UserModel user, @Nullable UserDetailsWithId currentUser) {
        if (user.visibility().equals(UserVisibilityModel.PUBLIC)) {
            return true;
        }

        if (currentUser == null) {
            return false;
        }
        if (currentUser.getId().equals(user.id())) {
            return true;
        }
        if (UserDetailsServiceImpl.isAdmin(currentUser)) {
            return true;
        }
        return false;
    }

    public void requireUserVisible(UserModel user, @Nullable UserDetailsWithId currentUser) {
        if (!isUserVisible(user, currentUser)) {
            throw ApiException.forbidden().message("no permission to access user %s".formatted(user.id())).build();
        }
    }

    public UserModel createUser(UserModel request) {
        return userRepository.save(request);
    }
}

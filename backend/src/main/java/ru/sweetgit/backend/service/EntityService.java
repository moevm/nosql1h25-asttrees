package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.FullUserModel;
import ru.sweetgit.backend.repo.UserRepository;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class EntityService {
    private final UserRepository userRepository;

    public Collection<FullUserModel> getUserEntities() {
        return userRepository.findAllFull();
    }
}

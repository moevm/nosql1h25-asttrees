package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.CommitModel;
import ru.sweetgit.backend.repo.CommitRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommitService {
    private final CommitRepository commitRepository;

    public Optional<CommitModel> getById(String commitId) {
        return commitRepository.findById(commitId);
    }
}

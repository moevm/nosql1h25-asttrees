package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.FullBranchModel;
import ru.sweetgit.backend.model.FullCommitModel;
import ru.sweetgit.backend.model.FullRepositoryModel;
import ru.sweetgit.backend.model.FullUserModel;
import ru.sweetgit.backend.repo.BranchRepository;
import ru.sweetgit.backend.repo.CommitRepository;
import ru.sweetgit.backend.repo.RepositoryRepository;
import ru.sweetgit.backend.repo.UserRepository;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class EntityService {
    private final UserRepository userRepository;
    private final RepositoryRepository repositoryRepository;
    private final BranchRepository branchRepository;
    private final CommitRepository commitRepository;

    public Collection<FullUserModel> getUserEntities() {
        return userRepository.findAllFull();
    }

    public Collection<FullRepositoryModel> getRepositoryEntities() {
        return repositoryRepository.findAllFull();
    }

    public Collection<FullBranchModel> getBranchEntities() {
        return branchRepository.findAllFull();
    }

    public Collection<FullCommitModel> getCommitEntities() {
        return commitRepository.findAllFull();
    }
}

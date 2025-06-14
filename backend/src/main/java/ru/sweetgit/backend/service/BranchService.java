package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.BranchModel;
import ru.sweetgit.backend.repo.BranchRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;

    public Optional<BranchModel> getByRepoAndId(String repoId, String branchId) {
        return branchRepository.findById(branchId)
                .filter(it -> it.getRepository().getId().equals(repoId));
    }
}

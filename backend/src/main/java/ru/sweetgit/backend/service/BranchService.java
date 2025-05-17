package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.BranchModel;
import ru.sweetgit.backend.model.RepositoryModel;
import ru.sweetgit.backend.repo.BranchRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository branchRepository;
}

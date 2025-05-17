package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.repo.CommitRepository;

@Service
@RequiredArgsConstructor
public class CommitService {
    private final CommitRepository commitRepository;

}

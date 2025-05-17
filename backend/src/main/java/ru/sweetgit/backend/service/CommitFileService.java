package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.CommitFileModel;
import ru.sweetgit.backend.repo.CommitFileRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommitFileService {
    private final CommitFileRepository commitFileRepository;

    public Optional<CommitFileModel> getByCommitAndId(String commitId, String commitFileId) {
        return commitFileRepository.findById(commitFileId)
                .filter(it -> it.getCommit().getId().equals(commitId));
    }
}

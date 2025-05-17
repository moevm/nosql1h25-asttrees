package ru.sweetgit.backend.service;

import com.arangodb.springframework.core.template.ArangoTemplate;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RepositoryService {
    private final RepositoryRepository repositoryRepository;
    private final BranchRepository branchRepository;
    private final ArangoTemplate arangoTemplate;
    private final CommitRepository commitRepository;
    private final BranchCommitRepository branchCommitRepository;
    private final CommitFileRepository commitFileRepository;

    public Optional<RepositoryModel> getById(String id) {
        return repositoryRepository.findById(id);
    }

    public List<RepositoryModel> getRepositoriesForUser(UserModel user) {
        return repositoryRepository.findAllByOwnerId(user.getId());
    }

    public RepositoryModel createRepository(
            UserDetailsWithId currentUser,
            CreateRepositoryRequest request
    ) {
        var repo = repositoryRepository.save(new RepositoryModel(
                null,
                null,
                request.name(),
                UserModel.builder().id(currentUser.getId()).build(),
                request.originalLink().toString(),
                RepositoryVisibilityModel.PUBLIC,
                Instant.now()
        ));
        var commitInitial = commitRepository.save(new CommitModel(
                null,
                null,
                "test-hash-initial",
                "max",
                "max@max.max",
                "initial commit",
                1,
                1,
                0,
                List.of(),
                Instant.now(),
                null
        ));
        var commitUpdate = commitRepository.save(new CommitModel(
                null,
                null,
                "test-hash-update",
                "max",
                "max@max.max",
                "initial commit",
                5,
                2,
                0,
                List.of(),
                Instant.now(),
                null
        ));
        var branch1 = branchRepository.save(new BranchModel(
                null,
                null,
                "master",
                repo,
                true,
                Instant.now(),
                null
        ));
        var branch2 = branchRepository.save(new BranchModel(
                null,
                null,
                "dev",
                repo,
                false,
                Instant.now(),
                null
        ));

        var fileReadme = commitFileRepository.save(new CommitFileModel(
                null,
                null,
                "README.md",
                "README.md",
                FileTypeModel.FILE,
                "readme-md-hash-1",
                commitInitial,
                null
        ));
        var fileReadmeInUpdate = commitFileRepository.save(new CommitFileModel(
                null,
                null,
                "README.md",
                "README.md",
                FileTypeModel.FILE,
                "readme-md-hash-2",
                commitUpdate,
                null
        ));
        var fileSrc = commitFileRepository.save(new CommitFileModel(
                null,
                null,
                "src",
                "src",
                FileTypeModel.DIRECTORY,
                null,
                commitUpdate,
                null
        ));
        var fileHelloWorld = commitFileRepository.save(new CommitFileModel(
                null,
                null,
                "HelloWorld.java",
                "src/HelloWorld.java",
                FileTypeModel.FILE,
                "hello-world-hash-1",
                commitUpdate,
                fileSrc
        ));

        commitRepository.save(commitInitial.toBuilder().rootFiles(List.of(fileReadme)).build());
        commitRepository.save(commitUpdate.toBuilder().rootFiles(List.of(fileReadmeInUpdate, fileSrc)).build());

        branchCommitRepository.saveAll(List.of(
                new BranchCommitModel(branch1, commitInitial),
                new BranchCommitModel(branch2, commitInitial),
                new BranchCommitModel(branch2, commitUpdate)
        ));

        return repo;
    }

    public boolean isRepositoryVisible(RepositoryModel repository, @Nullable UserDetailsWithId currentUser) {
        if (repository.getVisibility().equals(RepositoryVisibilityModel.PUBLIC)) {
            return true;
        }

        if (currentUser == null) {
            return false;
        }

        if (repository.getVisibility().equals(RepositoryVisibilityModel.PROTECTED)) {
            return true;
        }

        return repository.getOwner().getId().equals(currentUser.getId());
    }

    public void requireRepositoryVisible(RepositoryModel repository, @Nullable UserDetailsWithId currentUser) {
        if (!isRepositoryVisible(repository, currentUser)) {
            throw ApiException.forbidden().message("no permission to access repository %s".formatted(repository.getId())).build();
        }
    }
}

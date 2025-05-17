package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.data.util.StreamUtils;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepositoryService {
    private final GitService gitService;
    private final RepositoryRepository repositoryRepository;
    private final BranchRepository branchRepository;
    private final CommitRepository commitRepository;
    private final BranchCommitRepository branchCommitRepository;
    private final CommitFileRepository commitFileRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public Optional<RepositoryModel> getById(String id) {
        return repositoryRepository.findById(id);
    }

    public List<RepositoryModel> getRepositoriesForUser(UserModel user) {
        return repositoryRepository.findAllByOwnerId(user.getId());
    }

    public RepositoryViewModel createRepository(
            UserDetailsWithId currentUser,
            CreateRepositoryRequest request
    ) {
        var result = gitService.importRepository(request.name(), request.originalLink());

        var repository = repositoryRepository.save(
                result.repositoryData()
                        .owner(userService.getUserById(currentUser.getId()).get())
                        .visibility(RepositoryVisibilityModel.valueOf(request.visibility().toString()))
                        .build()
        );
        var branches = StreamUtils.createStreamFromIterator(
                branchRepository.saveAll(
                        result
                                .branchData()
                                .values()
                                .stream()
                                .map(builder ->
                                        builder
                                                .repository(repository)
                                                .build()
                                )
                                .toList()
                ).iterator()
        ).collect(Collectors.toMap(BranchModel::getName, Function.identity()));
        var commits = StreamUtils.createStreamFromIterator(
                commitRepository.saveAll(
                        result
                                .commitData()
                                .values()
                                .stream()
                                .map(data -> data
                                        .commitModelBuilder()
                                        .build()
                                )
                                .toList()
                ).iterator()
        ).collect(Collectors.toMap(CommitModel::getHash, Function.identity()));

        var branchCommits = StreamUtils.createStreamFromIterator(
                branchCommitRepository.saveAll(
                        result
                                .relations()
                                .stream()
                                .map(relation -> new BranchCommitModel(
                                        BranchModel.builder().id(branches.get(relation.getKey()).getId()).build(),
                                        CommitModel.builder().id(commits.get(relation.getValue()).getId()).build()
                                ))
                                .toList()
                ).iterator()
        );

        var commitFiles = StreamUtils.createStreamFromIterator(
                commitFileRepository.saveAll(
                        result
                                .commitData()
                                .entrySet()
                                .stream()
                                .flatMap(entry -> entry.getValue()
                                        .files()
                                        .stream()
                                        .map(fileData -> fileData
                                                .entityBuilder()
                                                .commit(commits.get(entry.getKey()))
                                                .build()))
                                .toList()
                ).iterator()
        ).toList();

        var filesByCommit = commitFiles.stream()
                .collect(Collectors.groupingBy(
                        file -> file.getCommit().getHash(),
                        Collectors.toList()
                ));

        var rootFilesByCommit = filesByCommit.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream().filter(file -> file.getFullPath().equals(file.getName())).toList()
                ));

        result.commitData().keySet().forEach(commitHash -> {
            filesByCommit.putIfAbsent(commitHash, List.of());
            rootFilesByCommit.putIfAbsent(commitHash, List.of());
        });

        commitRepository.saveAll(
                commits
                        .values()
                        .stream()
                        .map(commit -> commit
                                .toBuilder()
                                .rootFiles(rootFilesByCommit.get(commit.getHash()))
                                .build())
                        .toList()
        );

        var fileDatas = result
                .commitData()
                .entrySet()
                .stream()
                .flatMap(entry -> entry.getValue()
                        .files()
                        .stream()
                        .flatMap(fileData -> {
                            var model = fileData.entityBuilder().build();
                            if (model.getType().equals(FileTypeModel.DIRECTORY)) {
                                return Optional.<Pair<String, byte[]>>empty().stream();
                            }
                            if (fileData.data() == null) {
                                return Optional.<Pair<String, byte[]>>empty().stream();
                            }
                            return Optional.of(Pair.of(model.getHash(), fileData.data())).stream();
                        }))
                .toList();

        for (var fileData : fileDatas) {
            fileStorageService.storeFile(fileData.getKey(), fileData.getValue());
            // TODO ast analyze
        }

        return viewRepository(
                repository.getId(),
                "default",
                "latest",
                null
        );
    }

    public RepositoryViewModel viewRepository(
            String repositoryId,
            String branchId,
            String commitHash,
            @Nullable String path
    ) {
        return repositoryRepository.viewRepository(
                repositoryId,
                branchId.equals("default") ? null : branchId,
                commitHash.equals("latest") ? null : commitHash,
                path
        );
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
            throw ApiException.forbidden().message("Нет прав для доступа к репозиторию %s".formatted(repository.getId())).build();
        }
    }
}

package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.StreamUtils;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportRepositoryOperation {
    private final GitService gitService;
    private final RepositoryRepository repositoryRepository;
    private final UserService userService;
    private final BranchRepository branchRepository;
    private final CommitRepository commitRepository;
    private final BranchCommitRepository branchCommitRepository;
    private final CommitFileRepository commitFileRepository;
    private final FileStorageService fileStorageService;
    private final AstTreeService astTreeService;
    private final AstGenerationService astGenerationService;
    private final RepositoryService repositoryService;

    private record FileData(
            String hash,
            String name,
            byte[] data
    ) {
    }
    // TODO проверка уникальности имени в рамках пользователя (?)
    public RepositoryViewModel importRepository(
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

        var initialModelsToSave = new ArrayList<CommitFileModel>();
        result.commitData().entrySet().forEach(commitEntry -> {
            String commitHash = commitEntry.getKey();
            CommitModel currentCommit = commits.get(commitHash);

            commitEntry.getValue().files().forEach(fileData -> {
                CommitFileModel model = fileData.entityBuilder()
                        .commit(currentCommit)
                        .build();
                initialModelsToSave.add(model);
            });
        });

        var savedModelsPass1 = StreamUtils.createStreamFromIterator(
                commitFileRepository.saveAll(initialModelsToSave).iterator()
        ).toList();

        var persistedModelsMap = new HashMap<String, Map<String, CommitFileModel>>();
        for (var savedModel : savedModelsPass1) {
            if (savedModel.getCommit() != null && savedModel.getCommit().getHash() != null && savedModel.getFullPath() != null) {
                persistedModelsMap
                        .computeIfAbsent(savedModel.getCommit().getHash(), k -> new HashMap<>())
                        .put(savedModel.getFullPath(), savedModel);
            }
        }

        var modelsToUpdateWithParents = new ArrayList<CommitFileModel>();
        for (CommitFileModel modelFromPass1 : savedModelsPass1) {
            var fullPath = modelFromPass1.getFullPath();
            var name = modelFromPass1.getName();
            CommitFileModel parentEntity = null;

            if (fullPath != null && name != null && !fullPath.equals(name)) {
                if (fullPath.length() > name.length() && fullPath.endsWith(name)) {
                    var parentDirFullPath = fullPath.substring(0, fullPath.length() - name.length() - 1);

                    if (modelFromPass1.getCommit() != null && modelFromPass1.getCommit().getHash() != null) {
                        var potentialParentsInSameCommit = persistedModelsMap.get(modelFromPass1.getCommit().getHash());
                        if (potentialParentsInSameCommit != null) {
                            var foundParent = potentialParentsInSameCommit.get(parentDirFullPath);
                            if (foundParent != null && foundParent.getType() == FileTypeModel.DIRECTORY) {
                                parentEntity = foundParent;
                            }
                        }
                    }
                }
            }

            if (parentEntity != null) {
                modelsToUpdateWithParents.add(modelFromPass1.toBuilder().parent(parentEntity).build());
            }
        }

        var savedModelsPass2 =StreamUtils.createStreamFromIterator(
                commitFileRepository.saveAll(modelsToUpdateWithParents).iterator()
        ).toList();

        var finalModelsById = savedModelsPass1.stream()
                .filter(m -> m.getId() != null)
                .collect(Collectors.toMap(CommitFileModel::getId, Function.identity(), (existing, replacement) -> replacement));

        for (var updatedModel : savedModelsPass2) {
            if (updatedModel.getId() != null) {
                finalModelsById.put(updatedModel.getId(), updatedModel);
            }
        }

        var commitFiles = new ArrayList<>(finalModelsById.values());

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
                                return Optional.<FileData>empty().stream();
                            }
                            if (fileData.data() == null) {
                                return Optional.<FileData>empty().stream();
                            }
                            return Optional.of(new FileData(
                                    model.getHash(),
                                    model.getName(),
                                    fileData.data()
                            )).stream();
                        }))
                .toList();

        var astCandidates = new HashMap<String, byte[]>();
        for (var fileData : fileDatas) {
            fileStorageService.storeFile(fileData.hash, fileData.data);
            if (fileData.name.endsWith(".java")) {
                astCandidates.put(fileData.hash, fileData.data);
            }
        }

        var newAstTrees = new HashMap<String, JsonNode>();
        for (var hash : astTreeService.findNonExistingKeys(astCandidates.keySet())) {
            var fileContent = astCandidates.get(hash);
            var maybeAst = astGenerationService.parseJavaAst(fileContent);
            if (maybeAst.isEmpty()) {
                continue;
            }
            var ast = maybeAst.get();
            newAstTrees.put(hash, ast);
        }

        astTreeService.saveAstTrees(newAstTrees);

        return repositoryService.viewRepository(
                repository.getId(),
                "default",
                "latest",
                null
        ).get();
    }
}

package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.StreamUtils;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
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

    public RepositoryViewModel importRepository(
            UserDetailsWithId currentUser,
            CreateRepositoryRequest request
    ) {
        var gitImportResult = gitService.importRepository(request.name(), request.originalLink());

        var inMemoryRepository = gitImportResult.repositoryData()
                .owner(userService.getUserById(currentUser.getId()).orElseThrow())
                .visibility(RepositoryVisibilityModel.valueOf(request.visibility().toString()))
                .id(UUID.randomUUID().toString())
                .build();
        repositoryRepository.save(inMemoryRepository);

        var inMemoryBranches = new HashMap<String, BranchModel>();
        var branchesToSave = new ArrayList<BranchModel>();
        for (var branchBuilderData : gitImportResult.branchData().values()) {
            var branch = branchBuilderData
                    .repository(inMemoryRepository)
                    .id(UUID.randomUUID().toString())
                    .build();
            inMemoryBranches.put(branch.getName(), branch);
            branchesToSave.add(branch);
        }
        if (!branchesToSave.isEmpty()) {
            branchRepository.saveAll(branchesToSave);
        }

        log.info("Saving commits");
        var inMemoryCommits = new HashMap<String, CommitModel>();
        var commitsToSave = new ArrayList<CommitModel>();
        for (var entry : gitImportResult.commitData().entrySet()){
            var commitData = entry.getValue();
            var commit = commitData.commitModelBuilder()
                    .id(UUID.randomUUID().toString())
                    .build();
            inMemoryCommits.put(commit.getHash(), commit);
            commitsToSave.add(commit);
        }
        if (!commitsToSave.isEmpty()) {
            commitRepository.saveAll(commitsToSave);
        }

        log.info("Saving branchCommits");
        var inMemoryBranchCommits = gitImportResult
                .relations()
                .stream()
                .map(relation -> new BranchCommitModel(
                        BranchModel.builder().id(inMemoryBranches.get(relation.getKey()).getId()).build(),
                        CommitModel.builder().id(inMemoryCommits.get(relation.getValue()).getId()).build()
                ))
                .toList();
        if(!inMemoryBranchCommits.isEmpty()){
            branchCommitRepository.saveAll(inMemoryBranchCommits);
        }

        var allInMemoryCommitFileModels = new ArrayList<CommitFileModel>();
        gitImportResult.commitData().entrySet().forEach(commitEntry -> {
            var commitHash = commitEntry.getKey();
            var currentInMemoryCommit = inMemoryCommits.get(commitHash);
            commitEntry.getValue().files().forEach(fileData -> {
                var model = fileData.entityBuilder()
                        .commit(currentInMemoryCommit)
                        .id(UUID.randomUUID().toString())
                        .build();
                allInMemoryCommitFileModels.add(model);
            });
        });

        if (!allInMemoryCommitFileModels.isEmpty()) {
            commitFileRepository.saveAll(allInMemoryCommitFileModels);
        }

        var inMemoryCommitFilesMap = new HashMap<String, Map<String, CommitFileModel>>();
        for (var model : allInMemoryCommitFileModels) {
            if (model.getCommit() != null && model.getCommit().getHash() != null && model.getFullPath() != null) {
                inMemoryCommitFilesMap
                        .computeIfAbsent(model.getCommit().getHash(), k -> new HashMap<>())
                        .put(model.getFullPath(), model);
            }
        }

        var modelsToUpdateWithParentsInDb = new ArrayList<CommitFileModel>();
        for (int i = 0; i < allInMemoryCommitFileModels.size(); i++) {
            var modelToPotentiallyUpdate = allInMemoryCommitFileModels.get(i);
            var fullPath = modelToPotentiallyUpdate.getFullPath();
            var name = modelToPotentiallyUpdate.getName();
            CommitFileModel parentEntity = null;

            if (fullPath != null && name != null && !fullPath.equals(name)) {
                if (fullPath.length() > name.length() && fullPath.endsWith(name)) {
                    var parentDirFullPath = fullPath.substring(0, fullPath.length() - name.length() - 1);
                    if (modelToPotentiallyUpdate.getCommit() != null && modelToPotentiallyUpdate.getCommit().getHash() != null) {
                        var potentialParentsInSameCommit = inMemoryCommitFilesMap.get(modelToPotentiallyUpdate.getCommit().getHash());
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
                var updatedModel = modelToPotentiallyUpdate.toBuilder()
                        .parent(parentEntity)
                        .build();
                allInMemoryCommitFileModels.set(i, updatedModel);
                if (updatedModel.getCommit() != null && updatedModel.getCommit().getHash() != null) {
                    inMemoryCommitFilesMap
                            .computeIfAbsent(updatedModel.getCommit().getHash(), k -> new HashMap<>())
                            .put(updatedModel.getFullPath(), updatedModel);
                }
                modelsToUpdateWithParentsInDb.add(updatedModel);
            }
        }

        if (!modelsToUpdateWithParentsInDb.isEmpty()) {
            commitFileRepository.saveAll(modelsToUpdateWithParentsInDb);
        }

        var filesByCommit = allInMemoryCommitFileModels.stream()
                .collect(Collectors.groupingBy(
                        file -> file.getCommit().getHash(),
                        Collectors.toList()
                ));

        var rootFilesByCommit = filesByCommit.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream().filter(file -> file.getFullPath().equals(file.getName())).toList()
                ));

        gitImportResult.commitData().keySet().forEach(commitHash -> {
            filesByCommit.putIfAbsent(commitHash, List.of());
            rootFilesByCommit.putIfAbsent(commitHash, List.of());
        });

        var internalFileDatas = gitImportResult
                .commitData()
                .entrySet()
                .stream()
                .flatMap(entry -> entry.getValue()
                        .files()
                        .stream()
                        .flatMap(gitFileData -> {
                            var tempModelInfo = gitFileData.entityBuilder().build();
                            if (tempModelInfo.getType().equals(FileTypeModel.DIRECTORY) || gitFileData.data() == null) {
                                return Optional.<FileData>empty().stream();
                            }
                            return Optional.of(new FileData(
                                    tempModelInfo.getHash(),
                                    tempModelInfo.getName(),
                                    gitFileData.data()
                            )).stream();
                        }))
                .distinct()
                .toList();

        var astCandidates = new HashMap<String, byte[]>();
        for (var fileData : internalFileDatas) {
            fileStorageService.storeFile(fileData.hash(), fileData.data());
            if (fileData.name().endsWith(".java")) {
                astCandidates.put(fileData.hash(), fileData.data());
            }
        }

        var newAstTrees = new HashMap<String, JsonNode>();
        if (!astCandidates.isEmpty()) {
            for (var hash : astTreeService.findNonExistingKeys(astCandidates.keySet())) {
                var fileContent = astCandidates.get(hash);
                astGenerationService.parseJavaAst(fileContent).ifPresent(ast -> newAstTrees.put(hash, ast));
            }
        }

        if(!newAstTrees.isEmpty()){
            astTreeService.saveAstTrees(newAstTrees);
        }

        return repositoryService.viewRepository(
                inMemoryRepository.getId(),
                "default",
                "latest",
                null
        ).orElseThrow(() -> new RuntimeException("Failed to view newly imported repository"));
    }
}

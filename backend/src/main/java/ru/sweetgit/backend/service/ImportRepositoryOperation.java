package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.StreamUtils;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.CreateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
        );
    }
}

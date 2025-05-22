package ru.sweetgit.backend.service;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.dto.request.UpdateRepositoryRequest;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.RepositoryRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RepositoryService {
    private final RepositoryRepository repositoryRepository;
    private final BranchService branchService;
    private final CommitFileService commitFileService;
    private final FileStorageService fileStorageService;
    private final AstTreeService astTreeService;

    public Optional<RepositoryModel> getById(String id) {
        return repositoryRepository.findById(id);
    }

    public List<RepositoryModel> getRepositoriesForUser(UserModel user) {
        return repositoryRepository.findAllByOwnerId(
                PageRequest.of(0, 10000, Sort.by(Sort.Order.desc("createdAt"))), // TODO add page support
                user.getId()
        ).toList();
    }


    public Optional<RepositoryViewModel> viewRepository(
            String repositoryId,
            String branchId,
            String commitId,
            @Nullable String path
    ) {
        return Optional.ofNullable(repositoryRepository.viewRepository(
                repositoryId,
                branchId.equals("default") ? null : branchId,
                commitId.equals("latest") ? null : commitId,
                path
        ));
    }

    public FileContentModel viewFileContent(
            String repositoryId,
            String branchId,
            String commitId,
            String commitFileId
    ) {
        var branch = branchService.getByRepoAndId(repositoryId, branchId)
                .orElseThrow(() -> ApiException.notFound("Ветка", "id", branchId).build());

        branch.getCommits().stream()
                .filter(it -> it.getId().equals(commitId))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Коммит", "id", commitId).build());

        var commitFile = commitFileService.getByCommitAndId(commitId, commitFileId)
                .orElseThrow(() -> ApiException.notFound("Файл коммита", "id", commitFileId).build());

        if (commitFile.getType().equals(FileTypeModel.DIRECTORY)) {
            throw ApiException.badRequest().message("Файл является директорией").build();
        }

        var fileData = fileStorageService.loadFile(commitFile.getHash()).orElse(new byte[0]);

        var hasAst = astTreeService.hasAstTree(commitFile.getHash());

        return new FileContentModel(
                commitFile,
                commitFile.getMetadata(),
                fileData,
                hasAst
        );
    }

    public FileAstModel viewFileAst(
            String repositoryId,
            String branchId,
            String commitId,
            String commitFileId
    ) {
        var branch = branchService.getByRepoAndId(repositoryId, branchId)
                .orElseThrow(() -> ApiException.notFound("Ветка", "id", branchId).build());

        branch.getCommits().stream()
                .filter(it -> it.getId().equals(commitId))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Коммит", "id", commitId).build());

        var commitFile = commitFileService.getByCommitAndId(commitId, commitFileId)
                .orElseThrow(() -> ApiException.notFound("Файл коммита", "id", commitFileId).build());

        if (commitFile.getType().equals(FileTypeModel.DIRECTORY)) {
            throw ApiException.badRequest().message("Файл является директорией").build();
        }

        var ast = astTreeService.getFileAstTree(commitFile.getHash())
                .orElseThrow(() -> ApiException.notFound("AST-дерево", "hash", commitFile.getHash()).build());

        return new FileAstModel(
                commitFile,
                ast
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

    // TODO проверка уникальности имени в рамках пользователя (?)
    public RepositoryModel updateRepository(RepositoryModel repo, UpdateRepositoryRequest request) {
        var builder = repo.toBuilder();

        if (request.name() != null) {
            builder = builder.name(request.name());
        }
        if (request.visibility() != null) {
            builder = builder.visibility(RepositoryVisibilityModel.valueOf(request.visibility().name()));
        }

        return repositoryRepository.save(builder.build());
    }
}

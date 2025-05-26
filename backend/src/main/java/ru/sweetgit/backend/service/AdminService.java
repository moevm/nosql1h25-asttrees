package ru.sweetgit.backend.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.request.*;
import ru.sweetgit.backend.dto.response.FileTypeDto;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.*;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final RepositoryRepository repositoryRepository;
    private final BranchRepository branchRepository;
    private final CommitRepository commitRepository;
    private final CommitFileRepository commitFileRepository;
    private final AstTreeRepository astTreeRepository;
    private final AstNodeRepository astNodeRepository;

    public void editUser(String id, @Valid AdminPatchUserRequest request) {
        var original = userRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("Пользователь", "id", id).build()
        );

        if (
                !request.username().equals(original.getUsername())
                        && userRepository.findByUsername(request.username()).isPresent()
        ) {
            throw ApiException.badRequest().message("Это имя уже занято").build();
        }

        userRepository.save(
                original.toBuilder()
                        .username(request.username())
                        .email(request.email())
                        .visibility(UserVisibilityModel.valueOf(request.visibility().name()))
                        .isAdmin(request.isAdmin())
                        .createdAt(request.createdAt().toInstant())
                        .build()
        );
    }

    public void editRepository(String id, @Valid AdminPatchRepositoryRequest request) {
        var original = repositoryRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("Репозиторий", "id", id).build()
        );

        var owner = userRepository.findById(request.owner()).orElseThrow(
                () -> ApiException.notFound("Пользователь", "id", request.owner()).build()
        );

        if (
                !request.name().equals(original.getName())
                        && repositoryRepository.findByOwnerIdAndName(owner.getId(), request.name()).isPresent()
        ) {
            throw ApiException.badRequest().message("Это имя уже занято").build();
        }

        repositoryRepository.save(
                original.toBuilder()
                        .name(request.name())
                        .owner(owner)
                        .visibility(RepositoryVisibilityModel.valueOf(request.visibility().name()))
                        .createdAt(request.createdAt().toInstant())
                        .originalLink(request.originalLink().toString())
                        .build()
        );
    }

    public void editBranch(String id, @Valid AdminPatchBranchRequest request) {
        var original = branchRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("Ветка", "id", id).build()
        );

        var repository = repositoryRepository.findById(request.repository()).orElseThrow(
                () -> ApiException.notFound("Репозиторий", "id", request.repository()).build()
        );

        if (
                !request.name().equals(original.getName())
                        && branchRepository.findByRepositoryIdAndName(repository.getId(), request.name()).isPresent()
        ) {
            throw ApiException.badRequest().message("Это имя уже занято").build();
        }

        branchRepository.save(
                original.toBuilder()
                        .name(request.name())
                        .repository(repository)
                        .createdAt(request.createdAt().toInstant())
                        .isDefault(request.isDefault())
                        .build()
        );
    }

    public void editCommit(String id, @Valid AdminPatchCommitRequest request) {
        var original = commitRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("Коммит", "id", id).build()
        );

        commitRepository.save(
                original.toBuilder()
                        .hash(request.hash())
                        .author(request.author())
                        .email(request.email())
                        .message(request.message())
                        .filesChanged(request.filesChanged())
                        .linesAdded(request.linesAdded())
                        .linesRemoved(request.linesRemoved())
                        .createdAt(request.createdAt().toInstant())
                        .build()
        );
    }

    public void editCommitFile(String id, @Valid AdminPatchCommitFileRequest request) {
        var original = commitFileRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("Файл", "id", id).build()
        );

        var commit = commitRepository.findById(request.commit()).orElseThrow(
                () -> ApiException.notFound("Коммит", "id", request.commit()).build()
        );

        var parent = (request.parent() == null)
                ? null
                : commitFileRepository.findById(request.parent()).orElseThrow(
                () -> ApiException.notFound("Файл", "id", request.parent()).build()
        );

        if (
                !original.getFullPath().equals(request.fullPath())
                        && commitFileRepository.findByCommitIdAndFullPath(commit.getId(), request.fullPath()).isPresent()
        ) {
            throw ApiException.badRequest().message("Файл с таким fullPath уже существует").build();
        }

        if (!(
                (parent == null && request.fullPath().equals(request.name()))
                        || (parent != null && request.fullPath().equals(parent.getFullPath() + "/" + request.name()))
        )) {
            throw ApiException.badRequest().message("Несовпадение name, parent и fullPath").build();
        }

        if (original.getType() == FileTypeModel.DIRECTORY
                && !request.name().equals(original.getName())
                && !commitFileRepository.findAllByParentId(original.getId()).isEmpty()) {
            throw ApiException.badRequest().message("Невозможно сменить имя непустой директории").build();
        }

        if (
                (original.getType() == FileTypeModel.FILE && request.hash() == null)
                        || (original.getType() == FileTypeModel.DIRECTORY && request.hash() != null)
        ) {
            throw ApiException.badRequest().message("Hash должен быть заполнен для файлов и опущен для директорий").build();
        }

        commitFileRepository.save(
                original.toBuilder()
                        .name(request.name())
                        .fullPath(request.fullPath())
                        .hash(request.hash())
                        .parent(parent)
                        .commit(commit)
                        .build()
        );
    }

    public void editAstTree(String id, @Valid AdminPatchAstTreeRequest request) {
        var original = astTreeRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("AST-дерево", "id", id).build()
        );

        astTreeRepository.save(
                original.toBuilder()
                        .createdAt(request.createdAt().toInstant())
                        .build()
        );
    }

    public void editAstNode(String id, @Valid AdminPatchAstNodeRequest request) {
        var original = astNodeRepository.findById(id).orElseThrow(
                () -> ApiException.notFound("AST-узел", "id", id).build()
        );

        var tree = astTreeRepository.findById(request.tree()).orElseThrow(
                () -> ApiException.notFound("AST-дерево", "id", request.tree()).build()
        );

        astNodeRepository.save(
                original.toBuilder()
                        .type(request.type())
                        .label(request.label())
                        .tree(tree)
                        .build()
        );
    }
}

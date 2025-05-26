package ru.sweetgit.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sweetgit.backend.annotation.IsAdmin;
import ru.sweetgit.backend.dto.request.*;
import ru.sweetgit.backend.service.AdminService;

@RestController
@RequiredArgsConstructor
@IsAdmin
public class AdminController {
    private final AdminService adminService;

    @PatchMapping("/admin/users/{userId}")
    public ResponseEntity<Void> patchUser(
            @PathVariable("userId") String userId,
            @Valid @RequestBody AdminPatchUserRequest request
    ) {
        adminService.editUser(userId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/repositories/{repositoryId}")
    public ResponseEntity<Void> patchRepository(
            @PathVariable("repositoryId") String repositoryId,
            @Valid @RequestBody AdminPatchRepositoryRequest request
    ) {
        adminService.editRepository(repositoryId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/branches/{branchId}")
    public ResponseEntity<Void> patchBranch(
            @PathVariable("branchId") String branchId,
            @Valid @RequestBody AdminPatchBranchRequest request
    ) {
        adminService.editBranch(branchId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/commits/{commitId}")
    public ResponseEntity<Void> patchCommit(
            @PathVariable("commitId") String commitId,
            @Valid @RequestBody AdminPatchCommitRequest request
    ) {
        adminService.editCommit(commitId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/commit_files/{commitFileId}")
    public ResponseEntity<Void> patchCommitFile(
            @PathVariable("commitFileId") String commitFileId,
            @Valid @RequestBody AdminPatchCommitFileRequest request
    ) {
        adminService.editCommitFile(commitFileId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/ast_trees/{astTreeId}")
    public ResponseEntity<Void> patchAstTree(
            @PathVariable("astTreeId") String astTreeId,
            @Valid @RequestBody AdminPatchAstTreeRequest request
    ) {
        adminService.editAstTree(astTreeId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/admin/ast_nodes/{astNodeId}")
    public ResponseEntity<Void> patchAstNode(
            @PathVariable("astNodeId") String astNodeId,
            @Valid @RequestBody AdminPatchAstNodeRequest request
    ) {
        adminService.editAstNode(astNodeId, request);
        return ResponseEntity.ok().build();
    }
}

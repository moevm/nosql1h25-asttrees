package ru.sweetgit.backend.model;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.util.List;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class FullCommitFileModel {
    String id;
    String arangoId;
    String name;
    String fullPath;
    FileTypeModel type;
    @Nullable
    String hash;
    @Nullable
    String parent;
    CommitModel commit;
    RepositoryModel repository;
    Boolean hasAst;
    Integer branchCount;
    List<String> branches;
    String originalAuthor;
    String lastChangedBy;
}

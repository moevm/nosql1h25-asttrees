package ru.sweetgit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.time.Instant;
import java.util.List;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class FullCommitModel {
    String id;
    String arangoId;
    String hash;
    String author;
    String email;
    String message;
    Integer filesChanged;
    Integer linesAdded;
    Integer linesRemoved;
    RepositoryModel repository;
    List<String> branches;
    Integer branchCount;
    Integer fileCount;
    Integer fileWithAstCount;
    Instant createdAt;
}

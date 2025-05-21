package ru.sweetgit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.time.Instant;

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
    Integer branchCount;
    Integer fileCount;
    Integer fileWithAstCount;
    Instant createdAt;
}

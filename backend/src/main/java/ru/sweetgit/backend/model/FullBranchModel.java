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
public class FullBranchModel {
    String id;
    String arangoId;
    String name;
    RepositoryModel repository;
    Boolean isDefault;
    Instant createdAt;
    List<String> commits;
    Integer commitCount;
}

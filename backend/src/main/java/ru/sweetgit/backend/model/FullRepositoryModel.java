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
public class FullRepositoryModel {
    String id;
    String arangoId;
    String name;
    UserModel owner;
    String originalLink;
    RepositoryVisibilityModel visibility;
    Instant createdAt;
    int branchCount;
    int commitCount;
}

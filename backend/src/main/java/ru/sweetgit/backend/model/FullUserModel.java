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
public class FullUserModel {
    String id;
    String arangoId;
    String username;
    String passwordHash;
    String email;
    Instant createdAt;
    UserVisibilityModel visibility;
    Boolean isAdmin;
    int repositoryCount;
}

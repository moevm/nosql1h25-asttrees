package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Ref;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Document("repositories")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class RepositoryModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String name;
    @Ref(lazy = true)
    UserModel owner;
    String originalLink;
    RepositoryVisibilityModel visibility;
    Instant createdAt;
}

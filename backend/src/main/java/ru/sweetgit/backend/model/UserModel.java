package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Document("users")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class UserModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String username;
    String passwordHash;
    String email;
    Instant createdAt;
    UserVisibilityModel visibility;
    Boolean isAdmin;
}

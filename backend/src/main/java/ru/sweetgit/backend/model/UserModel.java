package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Document("users")
public record UserModel(
        @Id
        String id,
        @ArangoId
        String arangoId,
        String username,
        String passwordHash,
        String email,
        Instant createdAt,
        UserVisibilityModel visibility,
        boolean isAdmin
) {
}

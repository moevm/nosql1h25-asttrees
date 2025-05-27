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

@Document("ast_trees")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class AstTreeModel {
    @Id
    String fileHash;
    @ArangoId
    String arangoId;
    Instant createdAt;
    @Ref(lazy = true)
    AstNodeModel rootNode;
}

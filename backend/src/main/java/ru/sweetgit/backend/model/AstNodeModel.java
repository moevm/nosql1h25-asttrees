package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

@Document("ast_nodes")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class AstNodeModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String label;
    String type;
}

package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Ref;
import com.arangodb.springframework.annotation.Relations;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.util.List;

@Document("branches")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class BranchModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String name;
    @Ref(lazy = true)
    RepositoryModel repository;
    Boolean isDefault;
    Instant createdAt;
    @Relations(edges = BranchCommitModel.class, lazy = true)
    List<CommitModel> commits;
}

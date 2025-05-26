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

@Document("commits")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class CommitModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String hash;
    String author;
    String email;
    String message;
    Integer filesChanged;
    Integer linesAdded;
    Integer linesRemoved;
//    @Ref(lazy = true)
//    List<CommitFileModel> rootFiles;
    Instant createdAt;
    @Relations(edges = BranchCommitModel.class, lazy = true)
    List<BranchModel> branches;
}

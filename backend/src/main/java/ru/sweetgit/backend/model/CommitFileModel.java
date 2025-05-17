package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import com.arangodb.springframework.annotation.Document;
import com.arangodb.springframework.annotation.Ref;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

@Document("commit_files")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class CommitFileModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    String name;
    String fullPath;
    FileTypeModel type;
    @Nullable
    String hash;
    @Nullable
    CommitFileMetadataModel metadata;
    @Ref(lazy = true)
    CommitModel commit;
    @Ref(lazy = true)
    @Nullable
    CommitFileModel parent;
}

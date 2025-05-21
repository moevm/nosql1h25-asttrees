package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.ArangoId;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;
import org.springframework.data.annotation.Id;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class ShortCommitFileModel {
    @Id
    String id;
    @ArangoId
    String arangoId;
    FileTypeModel type;
    @Nullable
    String hash;
}

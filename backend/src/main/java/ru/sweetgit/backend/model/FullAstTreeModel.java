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
public class FullAstTreeModel {
    String id;
    String arangoId;
    Instant createdAt;
    Integer depth;
    Integer size;
    ShortCommitFileModel commitFile;
}

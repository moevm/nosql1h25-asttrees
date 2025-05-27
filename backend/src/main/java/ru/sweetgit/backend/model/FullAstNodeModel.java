package ru.sweetgit.backend.model;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.util.List;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class FullAstNodeModel {
    String id;
    String arangoId;
    String label;
    String type;
    String tree;
    @Nullable
    String parent;
    List<String> children;
    Long childrenCount;
}

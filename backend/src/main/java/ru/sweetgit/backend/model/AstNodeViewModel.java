package ru.sweetgit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class AstNodeViewModel {
    AstNodeModel node;
    String parentId;
}

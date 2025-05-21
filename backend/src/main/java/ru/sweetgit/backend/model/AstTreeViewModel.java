package ru.sweetgit.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.util.List;

@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class AstTreeViewModel {
    Integer depth;
    Integer size;
    List<AstNodeViewModel> nodes;
}

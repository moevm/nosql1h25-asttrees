package ru.sweetgit.backend.model;


import com.arangodb.springframework.annotation.Edge;
import com.arangodb.springframework.annotation.From;
import com.arangodb.springframework.annotation.To;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

@Edge("ast_parents")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class AstParentModel {
    @From(lazy = true)
    AstNodeModel from;
    @To(lazy = true)
    AstNodeModel to;
}

package ru.sweetgit.backend.model;

import com.arangodb.springframework.annotation.Edge;
import com.arangodb.springframework.annotation.From;
import com.arangodb.springframework.annotation.To;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.NonFinal;

@Edge("branch_commits")
@AllArgsConstructor
@Value
@Builder(toBuilder = true)
@NonFinal
public class BranchCommitModel {
    @From(lazy = true)
    BranchModel branch;
    @To(lazy = true)
    CommitModel commit;
}

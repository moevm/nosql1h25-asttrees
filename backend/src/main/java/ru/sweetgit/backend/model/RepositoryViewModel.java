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
public class RepositoryViewModel {
    UserModel owner;
    RepositoryModel repository;
    List<BranchModel> branches;
    BranchModel branch;
    CommitModel commit;
    List<CommitFileModel> files;
    Integer commitCount;
}

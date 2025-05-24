package ru.sweetgit.backend.repo;


import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import jakarta.annotation.Nullable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import ru.sweetgit.backend.model.RepositoryModel;
import ru.sweetgit.backend.model.RepositoryViewModel;
import ru.sweetgit.backend.model.RepositoryVisibilityModel;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RepositoryRepository extends ArangoRepository<RepositoryModel, String> {
    @Query("""
            FOR repo in repositories
                FILTER repo.owner == CONCAT("users/", @ownerId)
                FILTER repo.visibility IN (FOR item IN @visibility RETURN item)
                #sort
                RETURN repo
            """)
    Collection<RepositoryModel> findAllByOwnerId(Sort sort, String ownerId, List<RepositoryVisibilityModel> visibility);

    @Query("""
            LET oneBranchForCommit = FIRST(
               FOR branch_node IN 1..1 INBOUND CONCAT("commits/", @commitId) branch_commits
                   LIMIT 1
                   RETURN branch_node
            )
            RETURN DOCUMENT(oneBranchForCommit.repository)
            """)
    Optional<RepositoryModel> findByCommitId(@Param("commitId") String commitId);

    @Query("""
            LET repoModel = DOCUMENT(CONCAT("repositories/", @repositoryId))
            FILTER repoModel
            
            LET ownerModel = DOCUMENT(repoModel.owner)
            FILTER ownerModel
            
            LET allRepoBranchModels = (
                FOR b IN branches
                    FILTER b.repository == repoModel._id
                    SORT b.isDefault DESC, b.name ASC
                    RETURN b
            )
            
            LET defaultBranchModel = (FOR b IN allRepoBranchModels FILTER b.isDefault LIMIT 1 RETURN b)[0]
            
            LET targetBranchModel = @branchId == null
                ? defaultBranchModel
                : (FOR b IN allRepoBranchModels FILTER b._key == @branchId LIMIT 1 RETURN b)[0]
            FILTER targetBranchModel
            
            LET branchCommitModels = (
                FOR commitNode IN 1..1 OUTBOUND targetBranchModel._id branch_commits
                    SORT commitNode.createdAt DESC
                    RETURN commitNode
            )
            
            LET targetCommitModel = @commitId == null
                ? (branchCommitModels)[0]
                : (
                    FOR c IN branchCommitModels
                        FILTER c._key == @commitId
                        LIMIT 1
                        RETURN c
                  )[0]
            FILTER targetCommitModel
            
            LET parentDirModelForListing = (@path == "" || @path == null)
                ? null
                : (
                    FOR dirCf IN commit_files
                        FILTER dirCf.commit == targetCommitModel._id
                        FILTER dirCf.fullPath == @path
                        FILTER dirCf.type == "DIRECTORY"
                        LIMIT 1
                        RETURN dirCf
                )[0]
            
            LET commitFileModels = (@path != "" AND @path != null AND parentDirModelForListing == null)
                ? []
                : (
                    FOR cf IN commit_files
                        FILTER cf.commit == targetCommitModel._id
                        FILTER cf.parent == (parentDirModelForListing == null ? null : parentDirModelForListing._id)
                        SORT cf.type DESC, cf.name ASC
                        RETURN cf
                )
            
            RETURN {
                owner: ownerModel,
                repository: repoModel,
                branches: allRepoBranchModels,
                branch: targetBranchModel,
                commit: targetCommitModel,
                files: commitFileModels,
                commitCount: LENGTH(branchCommitModels)
            }
            """)
    RepositoryViewModel viewRepository(
            @Param("repositoryId") String repositoryId,
            @Param("branchId") @Nullable String branchId,
            @Param("commitId") @Nullable String commitId,
            @Param("path") String path
    );

    Optional<RepositoryModel> findByOwnerIdAndName(String ownrId, String name);
}

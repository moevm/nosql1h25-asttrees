package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.entity.EntityQuery;
import ru.sweetgit.backend.entity.EntitySearchDto;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.EntityRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EntityService {
    private final EntityRepository entityRepository;
    @Qualifier("entityQueriesByName")
    private final Map<String, EntityQuery<?>> entityQueriesByName;

    public Page<FullUserModel> getUserEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.execute(
                (EntityQuery<FullUserModel>) entityQueriesByName.get("users"),
                searchDto
        );
    }

    public Page<FullRepositoryModel> getRepositoryEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.execute(
                (EntityQuery<FullRepositoryModel>) entityQueriesByName.get("repositories"),
                searchDto
        );
    }

    public Page<FullBranchModel> getBranchEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.execute(
                (EntityQuery<FullBranchModel>) entityQueriesByName.get("branches"),
                searchDto
        );
    }

    public Page<FullCommitModel> getCommitEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.execute(
                (EntityQuery<FullCommitModel>) entityQueriesByName.get("commits"),
                searchDto
        );
    }

    public Page<FullAstTreeModel> getAstTreeEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.execute(
                (EntityQuery<FullAstTreeModel>) entityQueriesByName.get("ast_trees"),
                searchDto
        );
    }
}

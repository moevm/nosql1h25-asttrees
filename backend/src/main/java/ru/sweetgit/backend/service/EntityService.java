package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.entity.EntityQuery;
import ru.sweetgit.backend.entity.EntitySearchDto;
import ru.sweetgit.backend.entity.EntityStatsRequestDto;
import ru.sweetgit.backend.model.*;
import ru.sweetgit.backend.repo.EntityRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntityService {
    private final EntityRepository entityRepository;
    @Qualifier("userEntityQuery")
    private final EntityQuery<FullUserModel> userEntityQuery;
    @Qualifier("repositoryEntityQuery")
    private final EntityQuery<FullRepositoryModel> repositoryEntityQuery;
    @Qualifier("commitEntityQuery")
    private final EntityQuery<FullCommitModel> commitEntityQuery;
    @Qualifier("branchEntityQuery")
    private final EntityQuery<FullBranchModel> branchEntityQuery;
    @Qualifier("astTreeEntityQuery")
    private final EntityQuery<FullAstTreeModel> astTreeEntityQuery;

    public Page<FullUserModel> getUserEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.executeSearch(
                userEntityQuery,
                searchDto
        );
    }

    public List<StatsEntryModel> getUserEntityStats(
            EntityStatsRequestDto statsRequestDto
    ) {
        return entityRepository.executeStats(
                userEntityQuery,
                statsRequestDto
        );
    }

    public Page<FullRepositoryModel> getRepositoryEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.executeSearch(
                repositoryEntityQuery,
                searchDto
        );
    }


    public List<StatsEntryModel> getRepositoryEntityStats(
            EntityStatsRequestDto statsRequestDto
    ) {
        return entityRepository.executeStats(
                repositoryEntityQuery,
                statsRequestDto
        );
    }

    public Page<FullBranchModel> getBranchEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.executeSearch(
                branchEntityQuery,
                searchDto
        );
    }


    public List<StatsEntryModel> getBranchEntityStats(
            EntityStatsRequestDto statsRequestDto
    ) {
        return entityRepository.executeStats(
                branchEntityQuery,
                statsRequestDto
        );
    }

    public Page<FullCommitModel> getCommitEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.executeSearch(
                commitEntityQuery,
                searchDto
        );
    }

    public List<StatsEntryModel> getCommitEntityStats(
            EntityStatsRequestDto statsRequestDto
    ) {
        return entityRepository.executeStats(
                commitEntityQuery,
                statsRequestDto
        );
    }

    public Page<FullAstTreeModel> getAstTreeEntities(
            EntitySearchDto searchDto
    ) {
        return entityRepository.executeSearch(
                astTreeEntityQuery,
                searchDto
        );
    }

    public List<StatsEntryModel> getAstTreeEntityStats(
            EntityStatsRequestDto statsRequestDto
    ) {
        return entityRepository.executeStats(
                astTreeEntityQuery,
                statsRequestDto
        );
    }
}

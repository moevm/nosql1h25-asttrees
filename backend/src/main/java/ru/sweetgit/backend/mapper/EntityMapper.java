package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.*;
import ru.sweetgit.backend.model.*;

@Mapper(config = MapperConfigImpl.class, uses = {
        AstMapper.class,
        BranchMapper.class,
        CommitFileMapper.class,
        CommitMapper.class,
        RepositoryMapper.class,
        UserMapper.class,
})
public abstract class EntityMapper {
    public abstract EntityBranchDto toEntityDto(FullBranchModel model);

    public abstract EntityRepositoryDto toEntityDto(FullRepositoryModel fullRepositoryModel);

    public abstract EntityUserDto toEntityDto(FullUserModel fullUserModel);

    public abstract EntityCommitDto toEntityDto(FullCommitModel fullCommitModel);

    public abstract EntityAstTreeDto toEntityDto(FullAstTreeModel model);
}

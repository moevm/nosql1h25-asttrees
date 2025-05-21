package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.EntityBranchDto;
import ru.sweetgit.backend.dto.response.EntityRepositoryDto;
import ru.sweetgit.backend.dto.response.EntityUserDto;
import ru.sweetgit.backend.model.FullBranchModel;
import ru.sweetgit.backend.model.FullRepositoryModel;
import ru.sweetgit.backend.model.FullUserModel;

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
}

package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.*;
import ru.sweetgit.backend.model.*;

import java.util.List;

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

    public abstract EntityCommitFileDto toEntityDto(FullCommitFileModel model);

    public abstract EntityAstNodeDto toEntityDto(FullAstNodeModel model);

    public EntityStatsDto toEntityDto(List<StatsEntryModel> list) {
        return new EntityStatsDto(list.stream().map(model -> new EntityStatsDto.Item(model.getXAxisValue(), model.getYAxisValue(), model.getCount())).toList());
    }
}

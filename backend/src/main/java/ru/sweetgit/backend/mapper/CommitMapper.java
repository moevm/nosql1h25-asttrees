package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import ru.sweetgit.backend.dto.response.CommitDto;
import ru.sweetgit.backend.model.CommitModel;

@Mapper(config = MapperConfigImpl.class)
public abstract class CommitMapper {
    @Mappings({
            @Mapping(target = "id", source = "commit.id"),
            @Mapping(target = "createdAt", source = "commit.createdAt")
    })
    public abstract CommitDto toCommitDto(CommitModel commit);
}

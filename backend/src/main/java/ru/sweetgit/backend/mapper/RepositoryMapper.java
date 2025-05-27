package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.sweetgit.backend.dto.response.EntityRepositoryDto;
import ru.sweetgit.backend.dto.response.RepositoryDto;
import ru.sweetgit.backend.dto.response.RepositoryWithOwnerDetailsDto;
import ru.sweetgit.backend.model.FullRepositoryModel;
import ru.sweetgit.backend.model.RepositoryModel;

@Mapper(config = MapperConfigImpl.class)
public abstract class RepositoryMapper {
    @Mapping(source = "owner.id", target = "owner")
    public abstract RepositoryDto toRepositoryDto(RepositoryModel repository);

    public abstract RepositoryWithOwnerDetailsDto toRepositoryWithOwnerDetailsDto(RepositoryModel repository);
}

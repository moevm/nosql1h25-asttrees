package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.BranchDto;
import ru.sweetgit.backend.model.BranchModel;

@Mapper(config = MapperConfigImpl.class)
public abstract class BranchMapper {
    public abstract BranchDto toBranchDto(BranchModel branch);
}

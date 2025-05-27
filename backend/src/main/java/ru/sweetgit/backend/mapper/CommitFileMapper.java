package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.CommitFileDto;
import ru.sweetgit.backend.dto.response.ShortCommitFileDto;
import ru.sweetgit.backend.model.CommitFileModel;

@Mapper(config = MapperConfigImpl.class)
public abstract class CommitFileMapper {
    public abstract CommitFileDto toCommitFileDto(CommitFileModel model);
    public abstract ShortCommitFileDto toShortCommitFileDto(CommitFileModel model);
}


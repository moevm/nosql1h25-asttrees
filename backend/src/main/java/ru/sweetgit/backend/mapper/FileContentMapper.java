package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.FileContentDto;
import ru.sweetgit.backend.model.FileContentModel;

import java.nio.charset.StandardCharsets;

@Mapper(config = MapperConfigImpl.class, uses = {
        CommitFileMapper.class
})
public abstract class FileContentMapper {
    public abstract FileContentDto toFileContentResponseDto(FileContentModel model);

    protected String mapContent(byte[] content) {
        return new String(content, StandardCharsets.UTF_8);
    }
}

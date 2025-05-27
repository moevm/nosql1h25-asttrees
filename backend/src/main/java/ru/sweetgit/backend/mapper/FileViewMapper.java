package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import ru.sweetgit.backend.dto.response.FileAstDto;
import ru.sweetgit.backend.dto.response.FileContentDto;
import ru.sweetgit.backend.model.FileAstModel;
import ru.sweetgit.backend.model.FileContentModel;

import java.nio.charset.StandardCharsets;

@Mapper(config = MapperConfigImpl.class, uses = {
        CommitFileMapper.class,
        AstMapper.class
})
public abstract class FileViewMapper {
    @Mappings({
            @Mapping(target = "lines", source = "metadata.lines"),
            @Mapping(target = "bytes", source = "metadata.bytes"),
            @Mapping(target = "isBinary", source = "metadata.isBinary"),
    })
    public abstract FileContentDto toFileContentResponseDto(FileContentModel model);

    public abstract FileAstDto toFileAstDto(FileAstModel model);

    protected String mapContent(byte[] content) {
        return new String(content, StandardCharsets.UTF_8);
    }
}

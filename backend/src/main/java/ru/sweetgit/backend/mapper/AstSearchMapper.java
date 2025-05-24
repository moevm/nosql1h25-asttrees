package ru.sweetgit.backend.mapper;


import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.AstSearchResultDto;
import ru.sweetgit.backend.model.AstSearchResultModel;

@Mapper(config = MapperConfigImpl.class, uses = {
        AstMapper.class,
        CommitFileMapper.class
})
public abstract class AstSearchMapper {
    public abstract AstSearchResultDto toAstSearchResultDto(AstSearchResultModel model);
}

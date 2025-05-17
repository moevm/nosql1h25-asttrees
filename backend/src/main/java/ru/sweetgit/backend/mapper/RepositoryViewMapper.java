package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.RepositoryViewDto;
import ru.sweetgit.backend.model.RepositoryViewModel;

@Mapper(
        config = MapperConfigImpl.class,
        uses = {
                RepositoryMapper.class,
                BranchMapper.class,
                CommitMapper.class,
                UserMapper.class,
                CommitFileMapper.class
        }
)
public abstract class RepositoryViewMapper {
    public abstract RepositoryViewDto toRepositoryViewModel(RepositoryViewModel repository);
}

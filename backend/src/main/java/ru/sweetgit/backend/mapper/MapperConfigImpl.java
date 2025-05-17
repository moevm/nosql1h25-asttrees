package ru.sweetgit.backend.mapper;

import org.mapstruct.MapperConfig;
import org.mapstruct.NullValueCheckStrategy;

@MapperConfig(
        uses = {BaseMapper.class},
        componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface MapperConfigImpl {
}

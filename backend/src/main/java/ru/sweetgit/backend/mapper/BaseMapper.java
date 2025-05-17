package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;

import java.net.URI;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring")
public interface BaseMapper {
     default OffsetDateTime map(Instant instant) {
        if (instant == null) {
            return null;
        }
        return instant.atOffset(ZoneOffset.UTC);
    }

    default String map(URI uri) {
         return uri.toString();
    }

    default URI map(String string) {
         return URI.create(string);
    }
}

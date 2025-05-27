package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.model.CommitFileModel;
import ru.sweetgit.backend.model.CommitModel;
import ru.sweetgit.backend.model.UserModel;

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

    default String mapCommit(CommitModel model) {
        return model.getId();
    }

    default String mapParent(CommitFileModel parent) {
        return parent.getId();
    }

    default String mapUserModel(UserModel model) {
         return model.getId();
    }
}

package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.sweetgit.backend.dto.request.AuthRegisterRequest;
import ru.sweetgit.backend.dto.response.EntityUserDto;
import ru.sweetgit.backend.dto.response.ShortUserDto;
import ru.sweetgit.backend.dto.response.UserDto;
import ru.sweetgit.backend.model.FullUserModel;
import ru.sweetgit.backend.model.UserModel;
import ru.sweetgit.backend.model.UserVisibilityModel;

import java.time.Instant;

@Mapper(config = MapperConfigImpl.class)
public abstract class UserMapper {
    @Autowired
    PasswordEncoder passwordEncoder;

    public abstract ShortUserDto toShortUserDto(UserModel user);

    public abstract UserDto toUserDto(UserModel user);

    public UserModel toUserModel(AuthRegisterRequest request) {
        return new UserModel(
                null,
                null,
                request.username(),
                passwordEncoder.encode(request.password()),
                request.email(),
                Instant.now(),
                UserVisibilityModel.PUBLIC,
                false
        );
    }
}

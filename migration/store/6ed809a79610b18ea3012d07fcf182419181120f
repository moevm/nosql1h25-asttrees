package ru.swiftail.dataobjects.api.io;

import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.exceptions.SerializerException;
import ru.swiftail.dataobjects.api.result.Result;

public interface Serializer <T> {

    @NotNull
    public Result<T, DataObjectsException> decode(@NotNull byte[] data);

    @NotNull
    public Result<byte[], DataObjectsException> encode(@NotNull T object);

}

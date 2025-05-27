package ru.swiftail.dataobjects.api.io;

import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.result.Result;

import java.util.function.Supplier;

public interface Storage {

    @NotNull
    public Result<byte[], DataObjectsException> read(@NotNull Supplier<byte[]> fallbackSupplier);

    @NotNull
    public Result<Void, DataObjectsException> write(@NotNull byte[] data);

}

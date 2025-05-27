package ru.swiftail.dataobjects.impl;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.swiftail.dataobjects.api.DataObject;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.io.Serializer;
import ru.swiftail.dataobjects.api.io.Storage;
import ru.swiftail.dataobjects.api.result.Result;

import java.io.Serializable;
import java.util.function.Supplier;

public class SimpleDataObject<T extends Serializable> implements DataObject<T> {

    @NotNull
    private final Storage storage;
    @NotNull
    private final Serializer<T> serializer;
    @Nullable
    private final T fallback;

    public SimpleDataObject(
            @NotNull Storage storage,
            @NotNull Serializer<T> serializer,
            @Nullable T fallback
    ) {
        this.storage = storage;
        this.serializer = serializer;
        this.fallback = fallback;
    }

    @NotNull
    private Supplier<byte[]> fallbackSupplier() {
        if(fallback == null)
            return () -> null;

        return () -> serializer.encode(fallback).require();
    }

    @NotNull
    @Override
    public Result<T, DataObjectsException> load() {
        return storage.read(fallbackSupplier())
                .flatMap(serializer::decode);
    }

    @NotNull
    @Override
    public Result<Void, DataObjectsException> save(@NotNull T data) {
        return serializer.encode(data)
                .flatMap(storage::write);
    }
}

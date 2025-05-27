package ru.swiftail.dataobjects.impl;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.swiftail.dataobjects.api.DataObject;

import java.io.Serializable;
import java.util.Objects;

public class CachedDataObject<T extends Serializable> {

    @NotNull
    private final DataObject<T> dataObject;
    @Nullable
    private T data = null;

    private CachedDataObject(@NotNull DataObject<T> dataObject) {
        this.dataObject = dataObject;
    }

    public static <T extends Serializable> CachedDataObject<T> from(DataObject<T> dataObject) {
        return new CachedDataObject<T>(dataObject);
    }

    private void load() {
        data = Objects.requireNonNull(dataObject.load().require());
    }

    @NotNull
    public T get() {
        if (data == null)
            load();
        return data;
    }

    @NotNull
    public T reload() {
        load();
        return get();
    }

    public void save(@NotNull T data) {
        dataObject.save(data).require();
        this.data = data;
    }

}

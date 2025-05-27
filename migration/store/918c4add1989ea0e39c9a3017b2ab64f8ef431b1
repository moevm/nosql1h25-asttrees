package ru.swiftail.dataobjects.api.io;

import org.jetbrains.annotations.NotNull;

import java.io.Serializable;

public interface DataFormat {

    @NotNull
    public <T extends Serializable> Serializer<T> createSerializer(@NotNull Class<T> type);

}

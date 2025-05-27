package ru.swiftail.dataobjects.api;

import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.result.Result;
import ru.swiftail.dataobjects.impl.DataObjectBuilder;

import java.io.Serializable;

public interface DataObject<T extends Serializable> {

    @NotNull
    Result<T, DataObjectsException> load();

    @NotNull Result<Void, DataObjectsException> save(@NotNull T data);

    static <T extends Serializable> DataObjectBuilder<T> builder(Class<T> type) {
        return new DataObjectBuilder<>(type);
    }
}

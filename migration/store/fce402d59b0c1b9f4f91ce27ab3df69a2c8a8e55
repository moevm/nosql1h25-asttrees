package ru.swiftail.dataobjects.impl;

import ru.swiftail.dataobjects.api.DataObject;
import ru.swiftail.dataobjects.api.io.DataFormat;
import ru.swiftail.dataobjects.api.io.Storage;

import java.io.Serializable;

public class DataObjectBuilder <T extends Serializable> {

    private final Class<T> type;

    private Storage storage;
    private DataFormat dataFormat;
    private T fallback;

    public DataObjectBuilder(Class<T> type) {
        this.type = type;
    }


    public DataObjectBuilder<T> setStorage(Storage storage) {
        this.storage = storage;
        return this;
    }

    public DataObjectBuilder<T> setDataFormat(DataFormat dataFormat) {
        this.dataFormat = dataFormat;
        return this;
    }

    public DataObjectBuilder<T> setFallback(T fallback) {
        this.fallback = fallback;
        return this;
    }

    public DataObject<T> build() {
        assert storage != null: "Storage must be specified";
        assert dataFormat != null: "DataFormat must be specified";

        return new SimpleDataObject<>(
                storage,
                dataFormat.createSerializer(type),
                fallback
        );
    }


}

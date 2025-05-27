package ru.swiftail.dataobjects.impl.df.jackson;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.exceptions.SerializerException;
import ru.swiftail.dataobjects.api.io.Serializer;
import ru.swiftail.dataobjects.api.result.Result;

import java.io.Serializable;

public class JacksonSerializer<T extends Serializable> implements Serializer<T> {

    private final ObjectWriter writer;
    private final ObjectReader reader;
    private final Class<T> type;

    public JacksonSerializer(ObjectWriter writer, ObjectReader reader, Class<T> type) {
        this.writer = writer;
        this.reader = reader;
        this.type = type;
    }

    @NotNull
    @Override
    public Result<T, DataObjectsException> decode(@NotNull byte[] data) {
        try {
            T value = reader.readValue(data, type);
            return Result.ok(value);
        } catch (Throwable throwable) {
            return Result.error(new SerializerException(
                    "Failed to deserialize object using ObjectReader",
                    throwable
            ));
        }
    }

    @NotNull
    @Override
    public Result<byte[], DataObjectsException> encode(@NotNull T object) {
        try {
            byte[] data = writer.writeValueAsBytes(object);
            return Result.ok(data);
        } catch (Throwable throwable) {
            return Result.error(new SerializerException(
                    "Failed to serialize object using ObjectWriter",
                    throwable
            ));
        }
    }

}

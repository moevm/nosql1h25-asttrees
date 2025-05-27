package ru.swiftail.dataobjects.impl.df.gson;

import com.google.gson.Gson;
import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.exceptions.SerializerException;
import ru.swiftail.dataobjects.api.io.Serializer;
import ru.swiftail.dataobjects.api.result.Result;

import java.io.Serializable;
import java.nio.charset.Charset;

public class GsonSerializer<T extends Serializable> implements Serializer<T> {

    private final Class<T> type;
    private final Gson gson;

    public GsonSerializer(Class<T> type, Gson gson) {
        this.type = type;
        this.gson = gson;
    }

    @NotNull
    @Override
    public Result<T, DataObjectsException> decode(@NotNull byte[] data) {
        try {
            String json = new String(data, Charset.defaultCharset());
            T obj = gson.fromJson(json, type);
            return Result.ok(obj);
        } catch (Throwable throwable) {
            return Result.error(new SerializerException(
                    "Failed to deserialize object using GSON",
                    throwable
            ));
        }
    }

    @NotNull
    @Override
    public Result<byte[], DataObjectsException> encode(@NotNull T object) {
        try {
            byte[] bytes = gson.toJson(object).getBytes(Charset.defaultCharset());
            return Result.ok(bytes);
        }catch (Throwable throwable) {
            return Result.error(new SerializerException(
                    "Failed to serialize object using GSON",
                    throwable
            ));
        }
    }
}

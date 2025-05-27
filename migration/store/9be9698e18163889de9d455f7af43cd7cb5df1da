package ru.swiftail.dataobjects.impl.df.gson;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.io.DataFormat;
import ru.swiftail.dataobjects.api.io.Serializer;

import java.io.Serializable;

public class GsonDataFormat implements DataFormat {

    private boolean pretty = false;
    private boolean requireExpose = false;

    // TODO: Need more? Add!
    private Gson createGson() {
        GsonBuilder gsonBuilder = new GsonBuilder();

        if (pretty) {
            gsonBuilder.setPrettyPrinting();
        }

        if (requireExpose) {
            gsonBuilder.excludeFieldsWithoutExposeAnnotation();
        }

        return gsonBuilder.create();
    }

    @NotNull
    @Override
    public <T extends Serializable> Serializer<T> createSerializer(@NotNull Class<T> type) {
        return new GsonSerializer<>(type, createGson());
    }

    public GsonDataFormat setPretty(boolean pretty) {
        this.pretty = pretty;
        return this;
    }

    public GsonDataFormat setRequireExpose(boolean requireExpose) {
        this.requireExpose = requireExpose;
        return this;
    }
}

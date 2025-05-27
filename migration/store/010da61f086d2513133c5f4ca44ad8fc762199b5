package ru.swiftail.dataobjects.impl.df.jackson.json;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.io.DataFormat;
import ru.swiftail.dataobjects.api.io.Serializer;
import ru.swiftail.dataobjects.format.jackson.shared.JacksonSerializer;

import java.io.Serializable;

public class JacksonJsonDataFormat implements DataFormat {

    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    private boolean pretty = false;

    private ObjectWriter createWriter() {
        if (pretty)
            return mapper.writerWithDefaultPrettyPrinter();
        else
            return mapper.writer();
    }

    private ObjectReader createReader() {
        return mapper.reader();
    }

    @NotNull
    @Override
    public <T extends Serializable> Serializer<T> createSerializer(@NotNull Class<T> type) {
        return new JacksonSerializer<>(createWriter(), createReader(), type);
    }

    public JacksonJsonDataFormat setPretty(boolean pretty) {
        this.pretty = pretty;
        return this;
    }
}

package ru.swiftail.dataobjects.impl.df.jackson.yaml;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.jetbrains.annotations.NotNull;
import ru.swiftail.dataobjects.api.io.DataFormat;
import ru.swiftail.dataobjects.api.io.Serializer;
import ru.swiftail.dataobjects.impl.df.jackson.JacksonSerializer;

import java.io.Serializable;

public class JacksonYamlDataFormat implements DataFormat {

    private static final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

    static {
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    }

    private ObjectWriter createWriter() {
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
}

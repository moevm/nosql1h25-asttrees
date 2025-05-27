package ru.swiftail.dataobjects;

import ru.swiftail.dataobjects.api.DataObject;
import ru.swiftail.dataobjects.api.io.DataFormat;
import ru.swiftail.dataobjects.api.io.DataFormats;
import ru.swiftail.dataobjects.impl.io.file.FileStorage;

import java.io.Serializable;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;

class DTO implements Serializable {
    private String data;
    private List<String> strings;
    private Float aFloat;

    private DTO() {
    }

    DTO(String data, List<String> strings, Float aFloat) {
        this.data = data;
        this.strings = strings;
        this.aFloat = aFloat;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", DTO.class.getSimpleName() + "[", "]")
                .add("data='" + data + "'")
                .add("strings=" + strings)
                .add("aFloat=" + aFloat)
                .toString();
    }
}

public class Test {

    private static void testDataObject(String filename, DataFormat dataFormat) {
        DataObject<DTO> dataObject = DataObject
                .builder(DTO.class)
                .setStorage(new FileStorage(Paths.get(filename)))
                .setDataFormat(dataFormat)
                .setFallback(new DTO("Hello world!", Arrays.asList("1","fff","ayy"), 3.14f))
                .build();

        System.out.println(dataObject.load());
    }

    public static void main(String[] args) {

        testDataObject("gson.json", DataFormats.gson().setPretty(true));
        testDataObject("jackson.json", DataFormats.jacksonJson().setPretty(true));
        testDataObject("yaml.yaml", DataFormats.yaml());

    }

}

package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gumtree.spoon.builder.Json4SpoonGenerator;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import spoon.Launcher;
import spoon.support.compiler.VirtualFile;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AstGenerationService {
    private final Json4SpoonGenerator json4SpoonGenerator;
    private final ObjectMapper objectMapper;

    @SneakyThrows
    public Optional<JsonNode> parseJavaAst(byte[] source) {
        var launcher = new Launcher();
        launcher.addInputResource(new VirtualFile(new String(source, StandardCharsets.UTF_8)));
        launcher.getEnvironment().setNoClasspath(true);
        launcher.getEnvironment().setAutoImports(true);

        var model = launcher.buildModel();
        var classes = model.getAllTypes();

        if (classes.size() != 1) {
            return Optional.empty();
        }
        var rootClass = classes.iterator().next();

        return Optional.of(objectMapper.readTree(json4SpoonGenerator.getJSONasString(rootClass)));
    }
}

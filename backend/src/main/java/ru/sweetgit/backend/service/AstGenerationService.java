package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gumtree.spoon.builder.Json4SpoonGenerator;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import spoon.Launcher;
import spoon.reflect.declaration.*;
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
        var module = model.getAllModules();

        if (module.size() != 1) {
            return Optional.empty();
        }

        CtElement rootNode = module.iterator().next();
        while (true) {
            if (rootNode instanceof CtModule ctModule) {
                if (ctModule.isUnnamedModule() && ctModule.getDirectChildren().size() == 1) {
                    rootNode = ctModule.getDirectChildren().iterator().next();
                    continue;
                }
            }
            if (rootNode instanceof CtPackage ctPackage) {
                if (ctPackage.isUnnamedPackage()) {
                    if (ctPackage.getDirectChildren().size() == 1) {
                        rootNode = ctPackage.getDirectChildren().iterator().next();
                        continue;
                    }
                } else {
                    if (ctPackage.getDirectChildren().size() == 1) {
                        var child = ctPackage.getDirectChildren().iterator().next();

                        if (child instanceof CtPackage childPackage) {
                            var qualifiedName = childPackage.getQualifiedName();
                            childPackage.setParent(null);
                            childPackage.setSimpleName(qualifiedName);
                            rootNode = childPackage;
                            continue;
                        }
                        if (child instanceof CtClass<?> childClass) {
                            var qualifiedName = childClass.getQualifiedName();
                            childClass.setParent(null);
                            childClass.setSimpleName(qualifiedName);
                            rootNode = childClass;
                            continue;
                        }
                        if (child instanceof CtInterface<?> childInterface) {
                            var qualifiedName = childInterface.getQualifiedName();
                            childInterface.setParent(null);
                            childInterface.setSimpleName(qualifiedName);
                            rootNode = childInterface;
                            continue;
                        }
                    }
                }
            }

            break;
        }

        return Optional.of(objectMapper.readTree(json4SpoonGenerator.getJSONasString(rootNode)));
    }
}

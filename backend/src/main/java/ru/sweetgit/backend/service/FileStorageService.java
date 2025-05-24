package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    public static final int LISTENER_ORDER = 0;

    @Value("${app.file-storage.path}")
    private Path fileStoragePath;

    @Order(LISTENER_ORDER)
    @EventListener(ApplicationReadyEvent.class)
    @SneakyThrows
    public void initialize() {
        fileStoragePath = fileStoragePath.toAbsolutePath();
        if (Files.exists(fileStoragePath)) {
            if (!Files.isDirectory(fileStoragePath)) {
                throw new IllegalStateException("fileStoragePath exists and is not a directory: " + fileStoragePath);
            }
        } else {
            Files.createDirectory(fileStoragePath);
        }
    }

    @SneakyThrows
    public void migrateFrom(Path directory) {
        FileUtils.copyDirectory(directory.toFile(), fileStoragePath.toFile());
    }

    @SneakyThrows
    public void storeFile(String hash, byte[] data) {
        Files.write(
                fileStoragePath.resolve(hash),
                data
        );
    }

    @SneakyThrows
    public Optional<byte[]> loadFile(String hash) {
        var file = fileStoragePath.resolve(hash);
        if (!Files.exists(file) || !Files.isRegularFile(file)) {
            return Optional.empty();
        }
        return Optional.of(Files.readAllBytes(file));
    }
}

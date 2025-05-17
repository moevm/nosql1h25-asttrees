package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileStorageService {
    @Value("${app.file-storage.path}")
    private Path fileStoragePath;

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

package ru.sweetgit.backend.service;

import com.arangodb.springframework.boot.autoconfigure.ArangoProperties;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.util.FileUtil;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BackupService {
    private final ArangoProperties arangoProperties;
    private final ExecService execService;

    @Value("${app.backup.executable.dump}")
    private Path dumpExecutablePath;
    @Value("${app.backup.executable.restore}")
    private Path restoreExecutablePath;

    @SneakyThrows
    public byte[] exportDatabase() {
        Path tempDir = Files.createTempDirectory("sweetgit-export");
        Path zipFile = Files.createTempFile("sweetgit-export", ".zip");
        try {
            var executionResult = execService.executeCommand(List.of(
                    dumpExecutablePath.toAbsolutePath().toString(),
                    "--server.endpoint",
                    "tcp://" + arangoProperties.getHosts().iterator().next(),
                    "--server.username",
                    arangoProperties.getUser(),
                    "--server.password",
                    arangoProperties.getPassword(),
                    "--server.database",
                    arangoProperties.getDatabase(),
                    "--output-directory",
                    tempDir.toAbsolutePath().toString(),
                    "--compress-output"
            ), Duration.ofMinutes(1));
            if (!executionResult.isSuccess()) {
                throw ApiException.builder(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Execution did not success: exitCode=%s, timeout=%s".formatted(executionResult.exitCode(), executionResult.timedOut())
                ).build();
            }

            FileUtil.zipDirectory(
                    tempDir,
                    zipFile
            );
            byte[] data = Files.readAllBytes(zipFile);

            var headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_TYPE, "application/zip");
            headers.setContentDisposition(ContentDisposition.attachment().filename("export.zip").build());

            return data;
        } finally {
            try {
                FileUtil.deleteDirectoryRecursively(tempDir);
            } catch (Exception ignored) {
            }
            try {
                Files.deleteIfExists(zipFile);
            } catch (Exception ignored) {
            }
        }
    }

    @SneakyThrows
    public void importDatabase(InputStream inputStream) {
        Path uploadFile = Files.createTempFile("sweetgit-import", ".zip");
        Path extractDir = Files.createTempDirectory("sweetgit-import");

        try {
            Files.copy(inputStream, uploadFile, StandardCopyOption.REPLACE_EXISTING);
            FileUtil.unzipDirectory(uploadFile, extractDir);

            var executionResult = execService.executeCommand(List.of(
                    restoreExecutablePath.toAbsolutePath().toString(),
                    "--server.endpoint",
                    "tcp://" + arangoProperties.getHosts().iterator().next(),
                    "--server.username",
                    arangoProperties.getUser(),
                    "--server.password",
                    arangoProperties.getPassword(),
                    "--server.database",
                    arangoProperties.getDatabase(),
                    "--input-directory",
                    extractDir.toAbsolutePath().toString(),
                    "--force-same-database",
                    "true"
            ), Duration.ofMinutes(1));
            if (!executionResult.isSuccess()) {
                throw ApiException.builder(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Execution did not success: exitCode=%s, timeout=%s".formatted(executionResult.exitCode(), executionResult.timedOut())
                ).build();
            }
        } finally {
            try {
                FileUtil.deleteDirectoryRecursively(extractDir);
            } catch (Exception ignored) {
            }
            try {
                Files.deleteIfExists(uploadFile);
            } catch (Exception ignored) {
            }
        }
    }
}

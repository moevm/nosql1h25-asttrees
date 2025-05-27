package ru.sweetgit.backend.service;

import com.arangodb.springframework.core.ArangoOperations;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Service
@RequiredArgsConstructor
public class MigrationService {
    public static final int LISTENER_ORDER = DatabaseInitializer.LISTENER_ORDER + 1;

    @Value("${app.migration.path:#{null}}")
    private @Nullable Path migrationPath;
    private final ArangoOperations arangoOperations;
    private final BackupService backupService;
    private final FileStorageService fileStorageService;
    private final ApplicationContext appContext;

    @Order(LISTENER_ORDER)
    @EventListener(ApplicationReadyEvent.class)
    @SneakyThrows
    public void initialize() {
        if (migrationPath != null) {
            log.info("Migration path provided: {}", migrationPath);
            var shouldMigrate = arangoOperations.collection("users").count() == 0;
            log.info("Should migrate: {}", shouldMigrate);
            if (shouldMigrate) {
                try {
                    migrate();
                } catch (Throwable e) {
                    log.error("Migration failed", e);
                    SpringApplication.exit(appContext, () -> 1);
                }
            }
        }
    }

    @SneakyThrows
    private void migrate() {
        var dbArchive = migrationPath.resolve("db.zip");
        var store = migrationPath.resolve("store");

        if (!Files.exists(dbArchive) || !Files.isRegularFile(dbArchive)) {
            throw new IllegalStateException("Migration db archive " + dbArchive.toAbsolutePath() + " not found or is not a file");
        }
        if (!Files.exists(store) || !Files.isDirectory(store)) {
            throw new IllegalStateException("Migration store " + store.toAbsolutePath() + " not found or is not a directory");
        }

        log.info("Performing db migration...");
        try (var is = Files.newInputStream(dbArchive)) {
            backupService.importDatabase(is);
        }
        log.info("Performing store migration...");
        fileStorageService.migrateFrom(store);

        log.info("Migration performed");
    }
}

package ru.swiftail.dataobjects.storage;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.swiftail.dataobjects.api.exceptions.DataObjectsException;
import ru.swiftail.dataobjects.api.exceptions.SourceIOException;
import ru.swiftail.dataobjects.api.exceptions.TargetIOException;
import ru.swiftail.dataobjects.api.io.Storage;
import ru.swiftail.dataobjects.api.result.Result;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Supplier;

public class FileStorage implements Storage {

    private final Path path;

    public FileStorage(Path path) {
        this.path = path;
    }

    @NotNull
    @Override
    public Result<Void, DataObjectsException> write(@NotNull byte[] data) {
        try {
            Files.createDirectories(path.getParent());
            Files.write(path, data);
            return Result.okVoid();
        } catch (Throwable throwable) {
            return Result.error(new TargetIOException(
                    String.format("Failed to write to file(%s)", path.toAbsolutePath()),
                    throwable
            ));
        }
    }

    @NotNull
    @Override
    public Result<byte[], DataObjectsException> read(@NotNull Supplier<byte[]> fallbackSupplier) {
        try {
            if(Files.notExists(path)) {
                @Nullable byte[] fallback = fallbackSupplier.get();

                if(fallback == null) {
                    return Result.error(new SourceIOException("No file exists to read from and no fallback is specified"));
                }

                // Write, and if success, return fallback
                return write(fallback).then(() -> fallback);
            }

            return Result.ok(Files.readAllBytes(path));
        } catch (Throwable throwable) {
            return Result.error(new SourceIOException(
                    String.format("Failed to read from file(%s)", path.toAbsolutePath()),
                    throwable
            ));
        }
    }
}

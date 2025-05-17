package ru.sweetgit.backend.util;

import lombok.experimental.UtilityClass;
import org.springframework.util.function.ThrowingConsumer;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

@UtilityClass
public class FileUtil {
    public static void deleteDirectoryRecursively(Path directoryPath) throws IOException {
        if (Files.notExists(directoryPath)) {
            return;
        }
        if (!Files.isDirectory(directoryPath)) {
            throw new IllegalArgumentException("Provided path is not a directory: " + directoryPath);
        }

        try (Stream<Path> walk = Files.walk(directoryPath)) {
            walk.sorted(Comparator.reverseOrder()).forEach((ThrowingConsumer<Path>) Files::delete);
        }
    }

    public static void zipDirectory(
            Path sourceDirectoryPath,
            Path targetZipFilePath
    ) throws IOException {
        if (Files.notExists(sourceDirectoryPath)) {
            throw new NoSuchFileException("Source directory does not exist: " + sourceDirectoryPath);
        }
        if (!Files.isDirectory(sourceDirectoryPath)) {
            throw new IllegalArgumentException("Source path is not a directory: " + sourceDirectoryPath);
        }
        if (Files.exists(targetZipFilePath) && !Files.isRegularFile(targetZipFilePath)) {
            throw new IllegalArgumentException("Target ZIP path exists but not a regular file: " + targetZipFilePath);
        }

        Path parentDir = targetZipFilePath.getParent();
        if (parentDir != null && Files.notExists(parentDir)) {
            Files.createDirectories(parentDir);
        }

        try (FileOutputStream fos = new FileOutputStream(targetZipFilePath.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos)) {

            Files.walkFileTree(sourceDirectoryPath, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                    String relativePath = sourceDirectoryPath.relativize(dir).toString();
                    if (!relativePath.isEmpty()) {
                        ZipEntry zipEntry = new ZipEntry(relativePath.replace(FileSystems.getDefault().getSeparator(), "/") + "/");
                        zos.putNextEntry(zipEntry);
                        zos.closeEntry();
                    }
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    String relativePath = sourceDirectoryPath.relativize(file).toString();
                    ZipEntry zipEntry = new ZipEntry(relativePath.replace(FileSystems.getDefault().getSeparator(), "/"));
                    zos.putNextEntry(zipEntry);

                    try (FileInputStream fis = new FileInputStream(file.toFile())) {
                        byte[] buffer = new byte[1024 * 4];
                        int length;
                        while ((length = fis.read(buffer)) > 0) {
                            zos.write(buffer, 0, length);
                        }
                    }
                    zos.closeEntry();
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
                    throw new IOException("Failed to access file/directory: " + file + " - " + exc.getMessage());
                }
            });
        }
    }

    public static void unzipDirectory(
            Path zipFilePath,
            Path destDirectory
    ) throws IOException {
        if (Files.notExists(destDirectory)) {
            Files.createDirectories(destDirectory);
        }

        final Path normalizedDestDir = destDirectory.toAbsolutePath().normalize();

        try (InputStream fis = Files.newInputStream(zipFilePath);
             ZipInputStream zis = new ZipInputStream(fis)) {

            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                Path entryPath = normalizedDestDir.resolve(zipEntry.getName()).normalize();

                if (!entryPath.startsWith(normalizedDestDir)) {
                    throw new IOException("Bad ZIP entry: " + zipEntry.getName());
                }

                if (zipEntry.isDirectory()) {
                    Files.createDirectories(entryPath);
                } else {
                    if (entryPath.getParent() != null && Files.notExists(entryPath.getParent())) {
                        Files.createDirectories(entryPath.getParent());
                    }
                    try (FileOutputStream fos = new FileOutputStream(entryPath.toFile())) {
                        byte[] buffer = new byte[1024 * 4];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
                zipEntry = zis.getNextEntry();
            }
        }
    }
}

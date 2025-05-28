package ru.sweetgit.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.sweetgit.backend.annotation.IsAdmin;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.service.BackupService;

@RestController
@RequiredArgsConstructor
@IsAdmin
public class BackupController {
    private final BackupService backupService;

    @PostMapping("/db/export")
    @SneakyThrows
    public ResponseEntity<byte[]> exportDatabase() {
        var data = backupService.exportDatabase();

        var headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, "application/zip");
        headers.setContentDisposition(ContentDisposition.attachment().filename("export.zip").build());

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(data);
    }

    @PostMapping(value = "/db/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SneakyThrows
    public ResponseEntity<Long> importDatabase(@RequestPart("file") MultipartFile multipartFile) {
        if (multipartFile.isEmpty()) {
            throw ApiException.badRequest().message("Файл пуст").build();
        }
        var originalFilename = multipartFile.getOriginalFilename();
        if (!originalFilename.toLowerCase().endsWith(".zip")) {
            throw ApiException.badRequest().message("Неверный тип файла. Загрузите .zip файл").build();
        }

        long result;
        try (var inputStream = multipartFile.getInputStream()) {
            result = backupService.importDatabase(inputStream);
        }

        return ResponseEntity.ok(result);
    }
}

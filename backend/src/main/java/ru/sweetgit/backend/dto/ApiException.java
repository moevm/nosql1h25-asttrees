package ru.sweetgit.backend.dto;

import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    private ApiException(String message, HttpStatus status, @Nullable Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    @Accessors(chain = true, fluent = true)
    @Setter
    public static class ApiExceptionBuilder {
        private HttpStatus status;
        private String message;
        private Throwable cause;

        private ApiExceptionBuilder() {}

        public ApiException build() {
            if (status == null) {
                throw new IllegalStateException("Status not set");
            }
            if (message == null) {
                throw new IllegalStateException("Message not set");
            }
            return new ApiException(message, status, cause);
        }
    }

    public static ApiException.ApiExceptionBuilder notFound(String entity, String field, String value) {
        return new ApiException.ApiExceptionBuilder()
                .status(HttpStatus.NOT_FOUND)
                .message("%s not found by %s: %s".formatted(entity, field, value));
    }

    public static ApiException.ApiExceptionBuilder forbidden() {
        return new ApiException.ApiExceptionBuilder()
                .status(HttpStatus.FORBIDDEN)
                .message("Access denied");
    }

    public static ApiException.ApiExceptionBuilder badRequest() {
        return new ApiException.ApiExceptionBuilder()
                .status(HttpStatus.BAD_REQUEST)
                .message("Bad request");
    }

    public static ApiException.ApiExceptionBuilder builder(HttpStatus status, String message) {
        return new ApiExceptionBuilder()
                .status(status)
                .message(message);
    }

}

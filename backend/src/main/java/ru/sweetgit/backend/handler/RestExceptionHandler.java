package ru.sweetgit.backend.handler;

import org.apache.tomcat.websocket.AuthenticationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ru.sweetgit.backend.dto.ApiException;
import ru.sweetgit.backend.dto.response.ErrorResponseDto;

import java.util.stream.Collectors;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    protected ResponseEntity<Object> handleApiException(ApiException ex, WebRequest request) {
        log.warn("API Exception: {} (Status: {}) - Path: {}", ex.getMessage(), ex.getStatus(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(ex.getMessage());
        return new ResponseEntity<>(ErrorResponseDto, ex.getStatus());
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex, WebRequest request) {
        log.warn("Access Denied: {} - Path: {}", ex.getMessage(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto("Access Denied: You do not have permission to perform this action.");
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        log.warn("Authentication Failed: {} - Path: {}", ex.getMessage(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto("Authentication Failed: " + ex.getMessage());
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResponseStatusException.class)
    protected ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        String message = ex.getReason() != null ? ex.getReason() : "An error occurred with status " + ex.getStatusCode().value();
        log.warn("ResponseStatusException: {} (Status: {}) - Path: {}", message, ex.getStatusCode(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(message);
        return new ResponseEntity<>(ErrorResponseDto, ex.getStatusCode());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> String.format("'%s': %s", error.getField(), error.getDefaultMessage()))
                .collect(Collectors.joining(", "));
        String errorMessage = "Validation failed: " + errors;
        log.warn("Validation Exception: {} - Path: {}", errorMessage, request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        log.warn("Malformed JSON request: {} - Path: {}", ex.getMessage(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto("Malformed JSON request. Please check the request body format.");
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errorMessage = String.format("HTTP method '%s' is not supported for this request. Supported methods are %s.",
                ex.getMethod(), ex.getSupportedHttpMethods());
        log.warn("Method Not Supported: {} - Path: {}", errorMessage, request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errorMessage = String.format("Required request parameter '%s' of type %s is not present.", ex.getParameterName(), ex.getParameterType());
        log.warn("Missing Parameter: {} - Path: {}", errorMessage, request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String requiredType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";
        String errorMessage = String.format("Parameter '%s' with value '%s' could not be converted to type '%s'.",
                ex.getName(), ex.getValue(), requiredType);
        log.warn("Type Mismatch: {} - Path: {}", errorMessage, request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto(errorMessage);
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        log.warn("Data Integrity Violation: {} - Path: {}", ex.getMessage(), request.getDescription(false));
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto("A data integrity issue occurred. This could be due to duplicate data or invalid references.");
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAllUncaughtException(Exception ex, WebRequest request) {
        log.error("Unhandled Exception - Path: {}", request.getDescription(false), ex);
        ErrorResponseDto ErrorResponseDto = new ErrorResponseDto("An unexpected internal server error occurred. Please try again later.");
        return new ResponseEntity<>(ErrorResponseDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

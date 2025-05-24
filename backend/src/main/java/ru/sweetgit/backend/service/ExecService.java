package ru.sweetgit.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Service
@Slf4j
public class ExecService {
    public record ExecutionResult(
            int exitCode,
            List<String> outputLines,
            boolean timedOut
    ) {
        public boolean isSuccess() {
            return exitCode == 0 && !timedOut;
        }
    }

    private record StreamGobbler(InputStream inputStream, Consumer<String> consumer) implements Runnable {
        @Override
        public void run() {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    consumer.accept(line);
                }
            } catch (IOException e) {
                log.trace("Error reading stream: {}", e.getMessage());
            }
        }
    }

    public ExecutionResult executeCommand(List<String> command, Duration timeout) {
        log.info("Executing command: {}", String.join(" ", command));

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);

        Process process = null;
        var outputLines = new ArrayList<String>();
        var errorLines = new ArrayList<String>();
        var streamExecutor = Executors.newFixedThreadPool(2);
        boolean timedOut = false;
        int exitCode;

        try {
            process = processBuilder.start();

            var outputGobbler = new StreamGobbler(process.getInputStream(), outputLines::add);

            streamExecutor.submit(outputGobbler);

            if (!process.waitFor(timeout.toMillis(), TimeUnit.MILLISECONDS)) {
                log.warn("Command timed out after {}: {}", timeout, String.join(" ", command));
                timedOut = true;
                process.destroyForcibly();
                if (!process.waitFor(500, TimeUnit.MILLISECONDS)) {
                    log.warn("Process did not terminate gracefully after destroyForcibly.");
                }
            }
            exitCode = process.exitValue();

        } catch (IOException e) {
            log.error("IOException during command execution: {}", String.join(" ", command), e);
            errorLines.add("IOException: " + e.getMessage());
            exitCode = -2;
        } catch (InterruptedException e) {
            log.warn("Command execution was interrupted: {}", String.join(" ", command), e);
            Thread.currentThread().interrupt();
            errorLines.add("InterruptedException: " + e.getMessage());
            timedOut = true;
            if (process.isAlive()) {
                process.destroyForcibly();
            }
            exitCode = -3;
        } finally {
            if (process != null && process.isAlive()) {
                log.warn("Process still alive in finally block, attempting to destroy forcibly.");
                process.destroyForcibly();
            }
            streamExecutor.shutdown();
            try {
                if (!streamExecutor.awaitTermination(2, TimeUnit.SECONDS)) {
                    log.warn("Stream gobbler executor did not terminate in time.");
                    streamExecutor.shutdownNow();
                }
            } catch (InterruptedException e) {
                log.warn("Interrupted while waiting for stream gobbler executor to terminate.");
                streamExecutor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        log.info("Command Exit Code: {}", exitCode);
        log.info("Command Timed Out: {}", timedOut);
        outputLines.forEach(line -> log.info("STDOUT: {}", line));

        return new ExecutionResult(exitCode, outputLines, timedOut);
    }
}

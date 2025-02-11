package ru.sweetgit.backend;

import org.springframework.boot.SpringApplication;

public class TestBackendApplication {

    public static void main(String[] args) {
        SpringApplication.from(BackendApplication::main).run(args);
    }

}

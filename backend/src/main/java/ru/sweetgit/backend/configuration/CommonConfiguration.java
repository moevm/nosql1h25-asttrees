package ru.sweetgit.backend.configuration;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;
import gumtree.spoon.builder.Json4SpoonGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonConfiguration {
    @Bean
    public Json4SpoonGenerator json4SpoonGenerator() {
        return new Json4SpoonGenerator();
    }

    @Bean
    public TimeBasedEpochRandomGenerator uuidGenerator() {
        return Generators.timeBasedEpochRandomGenerator();
    }
}

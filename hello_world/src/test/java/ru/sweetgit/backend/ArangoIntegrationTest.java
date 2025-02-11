package ru.sweetgit.backend;

import com.arangodb.ArangoDB;
import com.arangodb.springframework.config.ArangoConfiguration;
import com.arangodb.springframework.core.ArangoOperations;
import io.testcontainers.arangodb.containers.ArangoContainer;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
class ArangoIntegrationTest {
    private record UserEntity(String name) {}

    private static final Logger LOGGER = LoggerFactory.getLogger(ArangoIntegrationTest.class);

    @Container
    private static final ArangoContainer<?> CONTAINER = new ArangoContainer<>("arangodb:3.11.2")
            .waitingFor(new HostPortWaitStrategy().forPorts(8529))
            .withoutAuth();

    static {
        CONTAINER.setPortBindings(List.of("8529:8529"));
    }

    @Autowired
    private ArangoOperations arangoOperations;

    @Test
    void testDatabaseInteraction() {
        LOGGER.info("Starting testDatabaseInteraction test");
        assertThat(CONTAINER.isRunning()).isTrue();
        LOGGER.info("Arangodb container is running");

        LOGGER.info("Creating two users");
        arangoOperations.insertAll(List.of(
                new UserEntity("user1"),
                new UserEntity("user2")
        ), UserEntity.class);
        LOGGER.info("Selecting users:");
        for (var userEntity : arangoOperations.findAll(UserEntity.class)) {
            LOGGER.info(userEntity.toString());
        }
    }

    @TestConfiguration
    static class Config implements ArangoConfiguration {
        @Override
        public ArangoDB.Builder arango() {
            return new ArangoDB.Builder().host(CONTAINER.getHost(), 8529);
        }

        @Override
        public String database() {
            return "testdb";
        }
    }
}

package ru.sweetgit.backend.service;

import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ArangoSchemaInitializer {
    private final ArangoOperations arangoOperations;

    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        arangoOperations.collection("users");
    }
}

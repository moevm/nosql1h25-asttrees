package ru.sweetgit.backend.service;

import com.arangodb.entity.CollectionType;
import com.arangodb.model.CollectionCreateOptions;
import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArangoSchemaInitializer {
    private final ArangoOperations arangoOperations;

    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        arangoOperations.collection("users");
        arangoOperations.collection("repositories");
        arangoOperations.collection("branches");
        arangoOperations.collection("commits");
        arangoOperations.collection("commit_files");
        arangoOperations.collection("branch_commits", new CollectionCreateOptions().type(CollectionType.EDGES));
    }
}

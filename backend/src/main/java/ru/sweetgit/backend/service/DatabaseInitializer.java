package ru.sweetgit.backend.service;

import com.arangodb.entity.CollectionType;
import com.arangodb.model.CollectionCreateOptions;
import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer {
    public static final int LISTENER_ORDER = FileStorageService.LISTENER_ORDER + 1;

    private final ArangoOperations arangoOperations;

    @Order(LISTENER_ORDER)
    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        arangoOperations.collection("users");
        arangoOperations.collection("repositories");
        arangoOperations.collection("branches");
        arangoOperations.collection("commits");
        arangoOperations.collection("commit_files");
        arangoOperations.collection("ast_trees");
        arangoOperations.collection("ast_nodes");
        arangoOperations.collection("branch_commits", new CollectionCreateOptions().type(CollectionType.EDGES));
        arangoOperations.collection("ast_parents", new CollectionCreateOptions().type(CollectionType.EDGES));
    }
}

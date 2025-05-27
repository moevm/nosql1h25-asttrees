package ru.sweetgit.backend.service;

import com.arangodb.entity.CollectionType;
import com.arangodb.model.CollectionCreateOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer {
    public static final int LISTENER_ORDER = FileStorageService.LISTENER_ORDER + 1;

    private final ArangoOperations arangoOperations;

    @Order(LISTENER_ORDER)
    @EventListener(ApplicationReadyEvent.class)
    public void initialize() {
        var users = arangoOperations.collection("users");
        users.ensurePersistentIndex(List.of("username"), new PersistentIndexOptions().cacheEnabled(true));

        var repositories = arangoOperations.collection("repositories");
        repositories.ensurePersistentIndex(List.of("owner"), new PersistentIndexOptions().cacheEnabled(true));
        repositories.ensurePersistentIndex(List.of("name"), new PersistentIndexOptions().cacheEnabled(true));

        var branches = arangoOperations.collection("branches");
        branches.ensurePersistentIndex(List.of("name"), new PersistentIndexOptions().cacheEnabled(true));
        branches.ensurePersistentIndex(List.of("repository"), new PersistentIndexOptions().cacheEnabled(true));
        branches.ensurePersistentIndex(List.of("isDefault"), new PersistentIndexOptions().cacheEnabled(true));

        var commits = arangoOperations.collection("commits");
        commits.ensurePersistentIndex(List.of("hash"), new PersistentIndexOptions().cacheEnabled(true));
//        commits.ensurePersistentIndex(List.of("rootFiles[*]"), new PersistentIndexOptions().cacheEnabled(true));

        var commitFiles = arangoOperations.collection("commit_files");
        commitFiles.ensurePersistentIndex(List.of("name"), new PersistentIndexOptions().cacheEnabled(true));
        commitFiles.ensurePersistentIndex(List.of("fullPath"), new PersistentIndexOptions().cacheEnabled(true));
        commitFiles.ensurePersistentIndex(List.of("hash"), new PersistentIndexOptions().cacheEnabled(true));
        commitFiles.ensurePersistentIndex(List.of("commit"), new PersistentIndexOptions().cacheEnabled(true));
        commitFiles.ensurePersistentIndex(List.of("parent"), new PersistentIndexOptions().cacheEnabled(true));

        var astTrees = arangoOperations.collection("ast_trees");
        astTrees.ensurePersistentIndex(List.of("rootNode"), new PersistentIndexOptions().cacheEnabled(true));

        var astNodes = arangoOperations.collection("ast_nodes");
        astNodes.ensurePersistentIndex(List.of("type"), new PersistentIndexOptions().cacheEnabled(true));
        astNodes.ensurePersistentIndex(List.of("label"), new PersistentIndexOptions().cacheEnabled(true));
        astNodes.ensurePersistentIndex(List.of("tree"), new PersistentIndexOptions().cacheEnabled(true));

        arangoOperations.collection("branch_commits", new CollectionCreateOptions().type(CollectionType.EDGES));
        arangoOperations.collection("ast_parents", new CollectionCreateOptions().type(CollectionType.EDGES));
    }
}

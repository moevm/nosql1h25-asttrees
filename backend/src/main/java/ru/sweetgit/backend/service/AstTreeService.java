package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.AstNodeModel;
import ru.sweetgit.backend.model.AstParentModel;
import ru.sweetgit.backend.model.AstTreeModel;
import ru.sweetgit.backend.repo.AstNodeRepository;
import ru.sweetgit.backend.repo.AstParentRepository;
import ru.sweetgit.backend.repo.AstTreeRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AstTreeService {
    private final AstTreeRepository astTreeRepository;
    private final AstNodeRepository astNodeRepository;
    private final AstParentRepository astParentRepository;

    public Collection<String> findNonExistingKeys(Collection<String> keysToCheck) {
        return astTreeRepository.findNonExistingKeys(keysToCheck);
    }

    public List<AstTreeModel> saveAstTrees(Map<String, JsonNode> newAstTrees) {
        var savedTrees = new ArrayList<AstTreeModel>();
        for (Map.Entry<String, JsonNode> entry : newAstTrees.entrySet()) {
            String fileHash = entry.getKey();
            JsonNode rootJsonNode = entry.getValue();

            var savedRootAstNode = saveNodeAndItsChildrenRecursive(rootJsonNode, null);

            AstTreeModel treeToSave = AstTreeModel.builder()
                    .fileHash(fileHash)
                    .createdAt(Instant.now())
                    .rootNode(savedRootAstNode)
                    .build();

            AstTreeModel savedTree = astTreeRepository.save(treeToSave);
            savedTrees.add(savedTree);
        }
        return savedTrees;
    }

    private AstNodeModel saveNodeAndItsChildrenRecursive(JsonNode currentJsonNode, AstNodeModel parentDbNode) {
        var savedCurrentDbNode = astNodeRepository.save(
                AstNodeModel.builder()
                        .label(currentJsonNode.path("label").asText(""))
                        .type(currentJsonNode.path("type").asText(""))
                        .build()
        );

        if (parentDbNode != null) {
            var edge = AstParentModel.builder()
                    .from(parentDbNode)
                    .to(savedCurrentDbNode)
                    .build();
            astParentRepository.save(edge);
        }

        JsonNode childrenArray = currentJsonNode.path("children");
        if (childrenArray.isArray() && !childrenArray.isEmpty()) {
            for (JsonNode childJsonNode : childrenArray) {
                saveNodeAndItsChildrenRecursive(childJsonNode, savedCurrentDbNode);
            }
        }
        return savedCurrentDbNode;
    }
}

package ru.sweetgit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.model.AstNodeModel;
import ru.sweetgit.backend.model.AstParentModel;
import ru.sweetgit.backend.model.AstTreeModel;
import ru.sweetgit.backend.model.AstTreeViewModel;
import ru.sweetgit.backend.repo.AstNodeRepository;
import ru.sweetgit.backend.repo.AstParentRepository;
import ru.sweetgit.backend.repo.AstTreeRepository;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AstTreeService {
    private final AstTreeRepository astTreeRepository;
    private final AstNodeRepository astNodeRepository;
    private final AstParentRepository astParentRepository;
    private final TimeBasedEpochRandomGenerator uuidGenerator;

    public Collection<String> findNonExistingKeys(Collection<String> keysToCheck) {
        return astTreeRepository.findNonExistingKeys(keysToCheck);
    }

    public Optional<AstTreeViewModel> getFileAstTree(String hash) {
        return Optional.ofNullable(astTreeRepository.viewAstTree(hash));
    }

    public boolean hasAstTree(String hash) {
        return astTreeRepository.existsById(hash);
    }

    public List<AstTreeModel> saveAstTrees(Map<String, JsonNode> newAstTrees) {
        var allNodesToSave = new ArrayList<AstNodeModel>();
        var allEdgesToSave = new ArrayList<AstParentModel>();
        var astTreeModelsToSave = new ArrayList<AstTreeModel>();
        var keyToNodeMap = new HashMap<String, AstNodeModel>();

        for (var entry : newAstTrees.entrySet()) {
            var fileHash = entry.getKey();
            var rootJsonNode = entry.getValue();

            AstTreeModel treeToSave = AstTreeModel.builder()
                    .fileHash(fileHash)
                    .createdAt(Instant.now())
                    .build();

            AstNodeModel rootDbNode = collectNodesAndEdgesRecursiveWithClientIds(
                    treeToSave,
                    rootJsonNode,
                    null,
                    allNodesToSave,
                    allEdgesToSave,
                    keyToNodeMap
            );

            astTreeModelsToSave.add(treeToSave.toBuilder().rootNode(rootDbNode).build());
        }

        if (!allNodesToSave.isEmpty()) {
            astNodeRepository.saveAll(allNodesToSave);
        }

        if (!allEdgesToSave.isEmpty()) {
            astParentRepository.saveAll(allEdgesToSave);
        }

        var savedTrees = new ArrayList<AstTreeModel>();
        if (!astTreeModelsToSave.isEmpty()) {
            Iterable<AstTreeModel> savedTreeIterable = astTreeRepository.saveAll(astTreeModelsToSave);
            savedTreeIterable.forEach(savedTrees::add);
        }

        return savedTrees;
    }

    private AstNodeModel collectNodesAndEdgesRecursiveWithClientIds(
            AstTreeModel treeToSave,
            JsonNode currentJsonNode,
            AstNodeModel parentNodeModel,
            List<AstNodeModel> allNodesToSave,
            List<AstParentModel> allEdgesToSave,
            Map<String, AstNodeModel> keyToNodeMap
    ) {

        var generatedNodeKey = uuidGenerator.generate().toString();

        var currentNodeModel = AstNodeModel.builder()
                .id(generatedNodeKey)
                .label(currentJsonNode.path("label").asText(""))
                .type(currentJsonNode.path("type").asText(""))
                .tree(treeToSave)
                .build();
        allNodesToSave.add(currentNodeModel);
        keyToNodeMap.put(generatedNodeKey, currentNodeModel);

        if (parentNodeModel != null) {
            var edge = AstParentModel.builder()
                    .from(parentNodeModel)
                    .to(currentNodeModel)
                    .build();
            allEdgesToSave.add(edge);
        }

        var childrenArray = currentJsonNode.path("children");
        if (childrenArray.isArray() && !childrenArray.isEmpty()) {
            for (var childJsonNode : childrenArray) {
                collectNodesAndEdgesRecursiveWithClientIds(
                        treeToSave,
                        childJsonNode,
                        currentNodeModel,
                        allNodesToSave,
                        allEdgesToSave,
                        keyToNodeMap
                );
            }
        }
        return currentNodeModel;
    }
}

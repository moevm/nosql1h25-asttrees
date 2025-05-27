package ru.sweetgit.backend.repo;

import com.arangodb.springframework.annotation.Query;
import com.arangodb.springframework.repository.ArangoRepository;
import jakarta.annotation.Nullable;
import org.springframework.data.repository.query.Param;
import ru.sweetgit.backend.model.AstSearchResultModel;
import ru.sweetgit.backend.model.AstTreeModel;
import ru.sweetgit.backend.model.AstTreeViewModel;

import java.util.Collection;
import java.util.List;

public interface AstTreeRepository extends ArangoRepository<AstTreeModel, String> {
    @Query("""
            LET inputKeys = @keysToCheck
            FOR keyInList IN inputKeys
                FILTER DOCUMENT(#{#collection}, keyInList) == null
                RETURN keyInList
            """)
    Collection<String> findNonExistingKeys(@Param("keysToCheck") Collection<String> keysToCheck);

    @Query("""
             LET ast_tree_meta = DOCUMENT(CONCAT("ast_trees/", @hash))
             FILTER ast_tree_meta
            
             LET rootNode = DOCUMENT(ast_tree_meta.rootNode)
             FILTER rootNode
            
             LET traversalResults = (
                 FOR v, e, p IN 0..10000 OUTBOUND rootNode ast_parents
                     RETURN {
                         nodeOutput: {
                             node: v,
                             parentId: LENGTH(p.vertices) > 1 ? p.vertices[LENGTH(p.vertices)-2]._id : null
                         },
                         nodeSpecificDepth: LENGTH(p.edges)
                     }
             )
            
             RETURN traversalResults == [] ? { depth: 0, nodes: [] } : {
                 size: LENGTH(traversalResults[*].nodeOutput),
                 depth: MAX(traversalResults[*].nodeSpecificDepth),
                 nodes: traversalResults[*].nodeOutput
             }
            """)
    @Nullable AstTreeViewModel
    viewAstTree(@Param("hash") String hash);

    @Query("""
            FOR file IN commit_files
                FILTER file.commit == CONCAT("commits/", @commitId)
                LET tree = DOCUMENT(CONCAT("ast_trees/", file.hash))
                FILTER tree
                LET nodes = (
                    FOR node in ast_nodes
                        FILTER node.tree == tree._id
                        FILTER node.label == @label
                        FILTER (LENGTH(@types) == 0) OR (node.type IN @types)
                        RETURN node
                )
                FILTER LENGTH(nodes) != 0
                RETURN { file, nodes }
            """)
    Collection<AstSearchResultModel> findReferences(
            @Param("commitId") String commitId,
            @Param("label") String label,
            @Param("types") List<String> types
    );
}

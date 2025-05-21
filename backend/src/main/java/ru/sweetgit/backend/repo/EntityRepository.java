package ru.sweetgit.backend.repo;

import com.arangodb.model.AqlQueryOptions;
import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.sweetgit.backend.entity.EntityQuery;
import ru.sweetgit.backend.entity.EntitySearchDto;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntityRepository {
    private final ArangoOperations operations;

    public <T> PageImpl<T> execute(
            EntityQuery<T> entityQuery,
            EntitySearchDto searchDto
    ) {
        return execute(entityQuery, searchDto, Map.of(), new AqlQueryOptions());
    }

    @SneakyThrows
    public <T> PageImpl<T> execute(
            EntityQuery<T> entityQuery,
            EntitySearchDto searchDto,
            Map<String, Object> initialBindVars,
            AqlQueryOptions options
    ) {
        var bindVars = new HashMap<>(initialBindVars);
        var additionalBindVars = new AtomicInteger();
        var queryBuilder = new StringBuilder();
        queryBuilder.append(entityQuery.selectPart()).append("\n");
        queryBuilder.append("LET resultDoc = ").append(entityQuery.mergePart()).append("\n");

        for (var filter : searchDto.filter()) {
            queryBuilder.append("FILTER ").append(filter.kind().builder().build(
                    "resultDoc." + filter.fieldName(),
                    filter.parameters(),
                    (value) -> {
                        var newBindVarName = "__param_" + (additionalBindVars.getAndIncrement());
                        bindVars.put(newBindVarName, value);
                        return "@" + newBindVarName;
                    }
            )).append("\n");
        }

        if (searchDto.pageable().getSort().isSorted()) {
            var sortClause = searchDto.pageable().getSort().stream()
                    .map(order -> {
                        var aqlPath = "resultDoc." + order.getProperty();
                        return aqlPath + " " + (order.isAscending() ? "ASC" : "DESC");
                    })
                    .collect(Collectors.joining(", "));

            if (StringUtils.hasText(sortClause)) {
                queryBuilder.append("SORT ").append(sortClause).append("\n");
            }
        }

        if (searchDto.pageable().isPaged()) {
            queryBuilder.append("LIMIT @offset, @count").append("\n");
            bindVars.put("offset", searchDto.pageable().getOffset());
            bindVars.put("count", searchDto.pageable().getPageSize());
        }

        queryBuilder.append("RETURN resultDoc");

        try (var result = operations.query(
                queryBuilder.toString(),
                bindVars,
                options.fullCount(true),
                entityQuery.resultClass()
        )) {

            return new PageImpl<>(
                    result.asListRemaining(),
                    searchDto.pageable(),
                    ((Number) result.getStats().getFullCount()).longValue()
            );
        }
    }
}

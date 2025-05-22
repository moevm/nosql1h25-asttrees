package ru.sweetgit.backend.repo;

import com.arangodb.model.AqlQueryOptions;
import com.arangodb.springframework.core.ArangoOperations;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.sweetgit.backend.entity.EntityQuery;
import ru.sweetgit.backend.entity.EntitySearchDto;
import ru.sweetgit.backend.entity.EntityStatsRequestDto;
import ru.sweetgit.backend.entity.FilterKind;
import ru.sweetgit.backend.model.StatsEntryModel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntityRepository {
    private final ArangoOperations operations;
    @Qualifier("entityFilterMap")
    private final Map<String, FilterKind> entityFilterMap;

    private record QueryContext(
            StringBuilder queryBuilder,
            Map<String, Object> bindVars,
            AtomicInteger additionalBindVars,
            Function<Object, String> varBinder
    ) {
    }

    public <T> PageImpl<T> executeSearch(
            EntityQuery<T> entityQuery,
            EntitySearchDto searchDto
    ) {
        return executeSearch(entityQuery, searchDto, Map.of(), new AqlQueryOptions());
    }

    @SneakyThrows
    public <T> PageImpl<T> executeSearch(
            EntityQuery<T> entityQuery,
            EntitySearchDto searchDto,
            Map<String, Object> initialBindVars,
            AqlQueryOptions options
    ) {
        var ctx = buildQueryContext(
                entityQuery,
                searchDto,
                initialBindVars
        );

        if (searchDto.pageable().getSort().isSorted()) {
            var sortClause = searchDto.pageable().getSort().stream()
                    .map(order -> {
                        var aqlPath = "resultDoc." + order.getProperty();
                        return aqlPath + " " + (order.isAscending() ? "ASC" : "DESC");
                    })
                    .collect(Collectors.joining(", "));

            if (StringUtils.hasText(sortClause)) {
                ctx.queryBuilder.append("SORT ").append(sortClause).append("\n");
            }
        }

        if (searchDto.pageable().isPaged()) {
            ctx.queryBuilder.append("LIMIT @offset, @count").append("\n");
            ctx.bindVars.put("offset", searchDto.pageable().getOffset());
            ctx.bindVars.put("count", searchDto.pageable().getPageSize());
        }

        ctx.queryBuilder.append("RETURN resultDoc");

        try (var result = operations.query(
                ctx.queryBuilder.toString(),
                ctx.bindVars,
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

    public <T> List<StatsEntryModel> executeStats(
            EntityQuery<T> entityQuery,
            EntityStatsRequestDto statsRequestDto
    ) {
        return executeStats(entityQuery, statsRequestDto, Map.of(), new AqlQueryOptions());
    }

    @SneakyThrows
    public <T> List<StatsEntryModel> executeStats(
            EntityQuery<T> entityQuery,
            EntityStatsRequestDto statsRequestDto,
            Map<String, Object> initialBindVars,
            AqlQueryOptions options
    ) {
        var ctx = buildQueryContext(
                entityQuery,
                statsRequestDto.search(),
                initialBindVars
        );

        ctx.queryBuilder
                .append("COLLECT ")
                .append("xAxisGroupKey = ").append("resultDoc.").append(statsRequestDto.xAxisField())
                .append(", ")
                .append("yAxisGroupKey = ").append("resultDoc.").append(statsRequestDto.yAxisField())
                .append(" WITH COUNT INTO itemCount\n");

        ctx.queryBuilder.append("RETURN { xAxisValue: xAxisGroupKey, yAxisValue: yAxisGroupKey, count: itemCount }");

        try (var result = operations.query(
                ctx.queryBuilder.toString(),
                ctx.bindVars,
                options,
                StatsEntryModel.class
        )) {
            return result.asListRemaining();
        }
    }

    private <T> QueryContext buildQueryContext(
            EntityQuery<T> entityQuery,
            EntitySearchDto searchDto,
            Map<String, Object> initialBindVars
    ) {
        var bindVars = new HashMap<>(initialBindVars);
        var additionalBindVars = new AtomicInteger();
        var queryBuilder = new StringBuilder();
        queryBuilder.append(entityQuery.collectionPart()).append("\n");
        if (searchDto.idFilter() != null) {
            queryBuilder.append("FILTER entity._key == @__param_id\n");
            bindVars.put("__param_id", searchDto.idFilter());
        }
        queryBuilder.append(entityQuery.selectPart()).append("\n");
        queryBuilder.append("LET resultDoc = ").append(entityQuery.mergePart()).append("\n");

        Function<Object, String> varBinder = (value) -> {
            var newBindVarName = "__param_" + (additionalBindVars.getAndIncrement());
            bindVars.put(newBindVarName, value);
            return "@" + newBindVarName;
        };

        for (var filter : searchDto.filter()) {
            queryBuilder.append("FILTER ").append(filter.kind().builder().build(
                    "resultDoc." + filter.fieldName(),
                    filter.parameters(),
                    varBinder
            )).append("\n");
        }

        if (StringUtils.hasText(searchDto.query()) && !searchDto.searchFields().isEmpty()) {
            var searchFilter = entityFilterMap.get("string_contains");
            queryBuilder.append("FILTER ");
            queryBuilder.append(
                    searchDto.searchFields().stream()
                            .map(field -> searchFilter.builder().build(
                                    "resultDoc." + field,
                                    Map.of("value", searchDto.query()),
                                    varBinder
                            ))
                            .map(clause -> "(" + clause + ')')
                            .collect(Collectors.joining(" OR "))
            );
        }

        return new QueryContext(queryBuilder, bindVars, additionalBindVars, varBinder);
    }
}

package ru.sweetgit.backend.configuration;

import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.sweetgit.backend.entity.FilterKind;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class FilteringConfiguration {
    @Bean
    List<FilterKind> entityFilters() {
        return List.of(
                new FilterKind(
                        "int_equals",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s == %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_not_equals",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s != %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_ge",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s >= %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_gt",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s > %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_le",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s <= %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_lt",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s < %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_any_of",
                        Map.of("value", new TypeReference<List<Long>>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s in %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "int_between",
                        Map.of("from", new TypeReference<Long>() {
                                },
                                "to", new TypeReference<Long>() {
                                }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s in %s..%s",
                                fieldName,
                                varBinder.apply(parameters.get("from")),
                                varBinder.apply(parameters.get("to"))
                        ))
                ),
                new FilterKind(
                        "string_equals",
                        Map.of("value", new TypeReference<String>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s == %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "string_not_equals",
                        Map.of("value", new TypeReference<String>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "%s != %s",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "string_contains",
                        Map.of("value", new TypeReference<String>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "CONTAINS(LOWER(%s), LOWER(%s))",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "string_not_contains",
                        Map.of("value", new TypeReference<String>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "NOT CONTAINS(LOWER(%s), LOWER(%s))",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                ),
                new FilterKind(
                        "string_any_of",
                        Map.of("value", new TypeReference<List<String>>() {
                        }),
                        ((fieldName, parameters, varBinder) -> String.format(
                                "LOWER(%s) IN (FOR item IN %s RETURN LOWER(item))",
                                fieldName,
                                varBinder.apply(parameters.get("value"))
                        ))
                )
        );
    }

    @Bean
    Map<String, FilterKind> entityFilterMap(List<FilterKind> filterKinds) {
        return filterKinds.stream()
                .collect(Collectors.toMap(
                        FilterKind::name,
                        Function.identity()
                ));
    }
}

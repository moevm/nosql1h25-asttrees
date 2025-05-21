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
                        "string_equals",
                        Map.of("value", new TypeReference<String>() {
                        }),
                        (fieldName, parameters, varBinder) -> String.format("%s == %s", fieldName, varBinder.apply(parameters.get("value")))
                ),
                new FilterKind(
                        "int_equals",
                        Map.of("value", new TypeReference<Long>() {
                        }),
                        (fieldName, parameters, varBinder) -> String.format("%s == %s", fieldName, varBinder.apply(parameters.get("value")))
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

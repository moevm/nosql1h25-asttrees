package ru.sweetgit.backend.configuration;

import com.arangodb.ArangoDB;
import com.arangodb.ContentType;
import com.arangodb.serde.ArangoSerde;
import com.arangodb.springframework.config.ArangoConfiguration;
import com.arangodb.springframework.core.convert.ArangoConverter;
import com.arangodb.springframework.core.convert.ArangoTypeMapper;
import com.arangodb.springframework.core.convert.resolver.ResolverFactory;
import com.arangodb.springframework.core.mapping.ArangoMappingContext;
import com.arangodb.springframework.core.template.ArangoTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.CustomConversions;
import org.springframework.data.mapping.model.FieldNamingStrategy;

import java.util.Collection;
import java.util.Set;

@Configuration
public class ArangoCustomizer {
    @Bean
    @Primary
    public ArangoConfiguration primaryArangoConfiguration(
            ArangoConfiguration autoConfiguredArangoConfig
    ) {

        return new ArangoConfiguration() {
            @Override
            public ArangoDB.Builder arango() {
                return autoConfiguredArangoConfig.arango();
            }

            @Override
            public String database() {
                return autoConfiguredArangoConfig.database();
            }

            @Override
            public boolean returnOriginalEntities() {
                return false;
            }

            @Override
            public ContentType contentType() {
                return autoConfiguredArangoConfig.contentType();
            }

            @Override
            public ArangoTemplate arangoTemplate() throws Exception {
                return autoConfiguredArangoConfig.arangoTemplate();
            }

            @Override
            public ArangoSerde serde() throws Exception {
                return autoConfiguredArangoConfig.serde();
            }

            @Override
            public ArangoMappingContext arangoMappingContext() throws Exception {
                return autoConfiguredArangoConfig.arangoMappingContext();
            }

            @Override
            public ArangoConverter arangoConverter() throws Exception {
                return autoConfiguredArangoConfig.arangoConverter();
            }

            @Override
            public CustomConversions customConversions() {
                return autoConfiguredArangoConfig.customConversions();
            }

            @Override
            public Collection<Converter<?, ?>> customConverters() {
                return autoConfiguredArangoConfig.customConverters();
            }

            @Override
            public Set<? extends Class<?>> getInitialEntitySet() throws ClassNotFoundException {
                return autoConfiguredArangoConfig.getInitialEntitySet();
            }

            @Override
            public String[] getEntityBasePackages() {
                return autoConfiguredArangoConfig.getEntityBasePackages();
            }

            @Override
            public FieldNamingStrategy fieldNamingStrategy() {
                return autoConfiguredArangoConfig.fieldNamingStrategy();
            }

            @Override
            public String typeKey() {
                return autoConfiguredArangoConfig.typeKey();
            }

            @Override
            public ArangoTypeMapper arangoTypeMapper() throws Exception {
                return autoConfiguredArangoConfig.arangoTypeMapper();
            }

            @Override
            public ResolverFactory resolverFactory() {
                return autoConfiguredArangoConfig.resolverFactory();
            }
        };
    }
}

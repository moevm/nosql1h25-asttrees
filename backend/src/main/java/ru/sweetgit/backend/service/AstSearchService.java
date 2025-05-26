package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.request.AstSearchFindReferencesRequest;
import ru.sweetgit.backend.model.AstSearchResultModel;
import ru.sweetgit.backend.repo.AstTreeRepository;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class AstSearchService {
    private final AstTreeRepository astTreeRepository;

    public Collection<AstSearchResultModel> findReferences(String commitId, AstSearchFindReferencesRequest request) {
        return astTreeRepository.findReferences(commitId, request.typename(), request.types());
    }

}

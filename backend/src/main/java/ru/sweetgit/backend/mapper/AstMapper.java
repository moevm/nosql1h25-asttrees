package ru.sweetgit.backend.mapper;

import org.mapstruct.Mapper;
import ru.sweetgit.backend.dto.response.AstNodeDto;
import ru.sweetgit.backend.dto.response.AstTreeViewDto;
import ru.sweetgit.backend.model.AstNodeModel;
import ru.sweetgit.backend.model.AstNodeViewModel;
import ru.sweetgit.backend.model.AstTreeViewModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Mapper(config = MapperConfigImpl.class, uses = {
        CommitFileMapper.class
})
public abstract class AstMapper {

    public abstract AstTreeViewDto toAstTreeViewDto(AstTreeViewModel model);

    protected List<AstNodeDto> toAstNodeDto(List<AstNodeViewModel> models) {
        if (models == null || models.isEmpty()) {
            return List.of();
        }

        var dtoMap = new HashMap<String, AstNodeDto>();
        var rootNodes = new ArrayList<AstNodeDto>();

        for (AstNodeViewModel viewModel : models) {
            AstNodeModel nodeModel = viewModel.getNode();
            if (nodeModel == null) continue;

            AstNodeDto dto = new AstNodeDto(
                    nodeModel.getId(),
                    nodeModel.getLabel(),
                    nodeModel.getType(),
                    new ArrayList<>()
            );
            dtoMap.put(nodeModel.getArangoId(), dto);
        }

        for (AstNodeViewModel viewModel : models) {
            AstNodeModel nodeModel = viewModel.getNode();
            if (nodeModel == null) continue;

            String currentId = nodeModel.getArangoId();
            String parentId = viewModel.getParentId();

            AstNodeDto currentDto = dtoMap.get(currentId);
            if (currentDto == null) continue;

            if (parentId == null) {
                rootNodes.add(currentDto);
            } else {
                AstNodeDto parentDto = dtoMap.get(parentId);
                if (parentDto != null) {
                    parentDto.children().add(currentDto);
                } else {
                    rootNodes.add(currentDto);
                }
            }
        }

        return rootNodes;
    }

}

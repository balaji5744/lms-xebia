package com.geeknito.geeknito_backend.category.mapper;

import com.geeknito.geeknito_backend.category.dto.CategoryRequestDTO;
import com.geeknito.geeknito_backend.category.dto.CategoryResponseDTO;
import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-27T22:15:57+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryEntity toEntity(CategoryRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        CategoryEntity.CategoryEntityBuilder categoryEntity = CategoryEntity.builder();

        categoryEntity.name( dto.getName() );
        categoryEntity.icon( dto.getIcon() );
        categoryEntity.description( dto.getDescription() );
        categoryEntity.color( dto.getColor() );

        return categoryEntity.build();
    }

    @Override
    public CategoryResponseDTO toResponseDTO(CategoryEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryResponseDTO.CategoryResponseDTOBuilder categoryResponseDTO = CategoryResponseDTO.builder();

        categoryResponseDTO.id( entity.getId() );
        categoryResponseDTO.name( entity.getName() );
        categoryResponseDTO.icon( entity.getIcon() );
        categoryResponseDTO.description( entity.getDescription() );
        categoryResponseDTO.color( entity.getColor() );
        categoryResponseDTO.createdAt( entity.getCreatedAt() );
        categoryResponseDTO.updatedAt( entity.getUpdatedAt() );

        return categoryResponseDTO.build();
    }

    @Override
    public void updateEntityFromDto(CategoryRequestDTO dto, CategoryEntity entity) {
        if ( dto == null ) {
            return;
        }

        entity.setName( dto.getName() );
        entity.setIcon( dto.getIcon() );
        entity.setDescription( dto.getDescription() );
        entity.setColor( dto.getColor() );
        if ( dto.getActive() != null ) {
            entity.setActive( dto.getActive() );
        }
    }
}

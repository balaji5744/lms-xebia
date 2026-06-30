package com.geeknito.geeknito_backend.category.mapper;

import com.geeknito.geeknito_backend.category.dto.CategoryRequestDTO;
import com.geeknito.geeknito_backend.category.dto.CategoryResponseDTO;
import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-30T09:15:16+0530",
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

        categoryEntity.color( dto.getColor() );
        categoryEntity.description( dto.getDescription() );
        categoryEntity.icon( dto.getIcon() );
        categoryEntity.name( dto.getName() );

        return categoryEntity.build();
    }

    @Override
    public CategoryResponseDTO toResponseDTO(CategoryEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryResponseDTO.CategoryResponseDTOBuilder categoryResponseDTO = CategoryResponseDTO.builder();

        categoryResponseDTO.color( entity.getColor() );
        categoryResponseDTO.createdAt( entity.getCreatedAt() );
        categoryResponseDTO.description( entity.getDescription() );
        categoryResponseDTO.icon( entity.getIcon() );
        categoryResponseDTO.id( entity.getId() );
        categoryResponseDTO.name( entity.getName() );
        categoryResponseDTO.updatedAt( entity.getUpdatedAt() );

        return categoryResponseDTO.build();
    }

    @Override
    public void updateEntityFromDto(CategoryRequestDTO dto, CategoryEntity entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getActive() != null ) {
            entity.setActive( dto.getActive() );
        }
        entity.setColor( dto.getColor() );
        entity.setDescription( dto.getDescription() );
        entity.setIcon( dto.getIcon() );
        entity.setName( dto.getName() );
    }
}

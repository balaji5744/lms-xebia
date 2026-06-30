package com.geeknito.geeknito_backend.course.mapper;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import com.geeknito.geeknito_backend.course.dto.ModuleResponseDTO;
import com.geeknito.geeknito_backend.course.dto.SubmoduleResponseDTO;
import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import com.geeknito.geeknito_backend.entity.learning.ModuleEntity;
import com.geeknito.geeknito_backend.entity.learning.SubmoduleEntity;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-30T09:15:16+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public CourseCatalogCardDTO toCatalogCardDTO(CourseEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CourseCatalogCardDTO.CourseCatalogCardDTOBuilder courseCatalogCardDTO = CourseCatalogCardDTO.builder();

        courseCatalogCardDTO.duration( entity.getDuration() );
        courseCatalogCardDTO.id( entity.getId() );
        courseCatalogCardDTO.level( entity.getLevel() );
        courseCatalogCardDTO.shortDescription( entity.getShortDescription() );
        courseCatalogCardDTO.slug( entity.getSlug() );
        courseCatalogCardDTO.title( entity.getTitle() );

        return courseCatalogCardDTO.build();
    }

    @Override
    public CourseCatalogDetailDTO toCatalogDetailDTO(CourseEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CourseCatalogDetailDTO.CourseCatalogDetailDTOBuilder courseCatalogDetailDTO = CourseCatalogDetailDTO.builder();

        courseCatalogDetailDTO.description( entity.getDescription() );
        courseCatalogDetailDTO.duration( entity.getDuration() );
        courseCatalogDetailDTO.id( entity.getId() );
        courseCatalogDetailDTO.level( entity.getLevel() );
        courseCatalogDetailDTO.modules( moduleEntityListToModuleResponseDTOList( entity.getModules() ) );
        courseCatalogDetailDTO.shortDescription( entity.getShortDescription() );
        courseCatalogDetailDTO.slug( entity.getSlug() );
        courseCatalogDetailDTO.thumbnail( entity.getThumbnail() );
        courseCatalogDetailDTO.title( entity.getTitle() );

        return courseCatalogDetailDTO.build();
    }

    @Override
    public ModuleResponseDTO toModuleResponseDTO(ModuleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ModuleResponseDTO.ModuleResponseDTOBuilder moduleResponseDTO = ModuleResponseDTO.builder();

        moduleResponseDTO.description( entity.getDescription() );
        moduleResponseDTO.id( entity.getId() );
        moduleResponseDTO.moduleOrder( entity.getModuleOrder() );
        moduleResponseDTO.submodules( submoduleEntityListToSubmoduleResponseDTOList( entity.getSubmodules() ) );
        moduleResponseDTO.title( entity.getTitle() );

        return moduleResponseDTO.build();
    }

    @Override
    public SubmoduleResponseDTO toSubmoduleResponseDTO(SubmoduleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        SubmoduleResponseDTO.SubmoduleResponseDTOBuilder submoduleResponseDTO = SubmoduleResponseDTO.builder();

        submoduleResponseDTO.description( entity.getDescription() );
        submoduleResponseDTO.id( entity.getId() );
        submoduleResponseDTO.slug( entity.getSlug() );
        submoduleResponseDTO.submoduleOrder( entity.getSubmoduleOrder() );
        submoduleResponseDTO.title( entity.getTitle() );

        return submoduleResponseDTO.build();
    }

    protected List<ModuleResponseDTO> moduleEntityListToModuleResponseDTOList(List<ModuleEntity> list) {
        if ( list == null ) {
            return null;
        }

        List<ModuleResponseDTO> list1 = new ArrayList<ModuleResponseDTO>( list.size() );
        for ( ModuleEntity moduleEntity : list ) {
            list1.add( toModuleResponseDTO( moduleEntity ) );
        }

        return list1;
    }

    protected List<SubmoduleResponseDTO> submoduleEntityListToSubmoduleResponseDTOList(List<SubmoduleEntity> list) {
        if ( list == null ) {
            return null;
        }

        List<SubmoduleResponseDTO> list1 = new ArrayList<SubmoduleResponseDTO>( list.size() );
        for ( SubmoduleEntity submoduleEntity : list ) {
            list1.add( toSubmoduleResponseDTO( submoduleEntity ) );
        }

        return list1;
    }
}

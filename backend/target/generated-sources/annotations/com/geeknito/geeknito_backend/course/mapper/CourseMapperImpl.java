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
    date = "2026-06-26T14:14:39+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public CourseCatalogCardDTO toCatalogCardDTO(CourseEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CourseCatalogCardDTO.CourseCatalogCardDTOBuilder courseCatalogCardDTO = CourseCatalogCardDTO.builder();

        courseCatalogCardDTO.id( entity.getId() );
        courseCatalogCardDTO.title( entity.getTitle() );
        courseCatalogCardDTO.slug( entity.getSlug() );
        courseCatalogCardDTO.shortDescription( entity.getShortDescription() );
        courseCatalogCardDTO.level( entity.getLevel() );
        courseCatalogCardDTO.duration( entity.getDuration() );

        return courseCatalogCardDTO.build();
    }

    @Override
    public CourseCatalogDetailDTO toCatalogDetailDTO(CourseEntity entity) {
        if ( entity == null ) {
            return null;
        }

        CourseCatalogDetailDTO.CourseCatalogDetailDTOBuilder courseCatalogDetailDTO = CourseCatalogDetailDTO.builder();

        courseCatalogDetailDTO.id( entity.getId() );
        courseCatalogDetailDTO.title( entity.getTitle() );
        courseCatalogDetailDTO.slug( entity.getSlug() );
        courseCatalogDetailDTO.thumbnail( entity.getThumbnail() );
        courseCatalogDetailDTO.shortDescription( entity.getShortDescription() );
        courseCatalogDetailDTO.description( entity.getDescription() );
        courseCatalogDetailDTO.level( entity.getLevel() );
        courseCatalogDetailDTO.duration( entity.getDuration() );
        courseCatalogDetailDTO.modules( moduleEntityListToModuleResponseDTOList( entity.getModules() ) );

        return courseCatalogDetailDTO.build();
    }

    @Override
    public ModuleResponseDTO toModuleResponseDTO(ModuleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ModuleResponseDTO.ModuleResponseDTOBuilder moduleResponseDTO = ModuleResponseDTO.builder();

        moduleResponseDTO.id( entity.getId() );
        moduleResponseDTO.title( entity.getTitle() );
        moduleResponseDTO.description( entity.getDescription() );
        moduleResponseDTO.moduleOrder( entity.getModuleOrder() );
        moduleResponseDTO.submodules( submoduleEntityListToSubmoduleResponseDTOList( entity.getSubmodules() ) );

        return moduleResponseDTO.build();
    }

    @Override
    public SubmoduleResponseDTO toSubmoduleResponseDTO(SubmoduleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        SubmoduleResponseDTO.SubmoduleResponseDTOBuilder submoduleResponseDTO = SubmoduleResponseDTO.builder();

        submoduleResponseDTO.id( entity.getId() );
        submoduleResponseDTO.title( entity.getTitle() );
        submoduleResponseDTO.description( entity.getDescription() );
        submoduleResponseDTO.slug( entity.getSlug() );
        submoduleResponseDTO.submoduleOrder( entity.getSubmoduleOrder() );

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

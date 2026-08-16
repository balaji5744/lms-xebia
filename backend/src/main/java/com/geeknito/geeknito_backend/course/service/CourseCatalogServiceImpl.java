package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import com.geeknito.geeknito_backend.course.mapper.CourseMapper;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import com.geeknito.geeknito_backend.course.repository.ModuleRepository;
import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import com.geeknito.geeknito_backend.entity.learning.ModuleEntity;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseCatalogServiceImpl implements CourseCatalogService {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final CourseMapper courseMapper;

    @Override
    @Cacheable(value = "course-catalog", key = "#pageable")
    public Page<CourseCatalogCardDTO> getCatalogCourses(Pageable pageable) {
        log.info("Fetching public course catalog page: {}", pageable);
        // This takes the database entities and securely maps them to your lightweight DTOs
        return courseRepository.findByIsActiveTrue(pageable)
                .map(course -> CourseCatalogCardDTO.builder()
                        .id(course.getId())
                        .title(course.getTitle())
                        .slug(course.getSlug())
                        .shortDescription(course.getShortDescription())
                        .level(course.getLevel())
                        .duration(course.getDuration())
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "course-details", key = "#slug")
    public CourseCatalogDetailDTO getCourseDetailBySlug(String slug) {
        log.info("Fetching public course detail by slug: {}", slug);
        CourseEntity course = courseRepository.findCourseDetailBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));

        // Split-fetch strategy: load modules with their submodules to prevent MultipleBagFetchException
        List<ModuleEntity> modules = moduleRepository.findModulesWithSubmodulesByCourseId(course.getId());
        course.setModules(modules);

        return courseMapper.toCatalogDetailDTO(course);
    }

    @Override
    @Cacheable(value = "course-catalog", key = "'public-active'")
    public java.util.List<com.geeknito.geeknito_backend.course.dto.CourseResponseDTO> getActiveCourses() {
        log.info("Fetching public active course catalog");
        return courseRepository.findByIsActiveTrue().stream()
                .map(course -> {
                    Long categoryId = course.getCategory() != null ? course.getCategory().getId() : null;
                    String categoryName = course.getCategory() != null ? course.getCategory().getName() : null;

                    return com.geeknito.geeknito_backend.course.dto.CourseResponseDTO.builder()
                            .id(course.getId())
                            .title(course.getTitle())
                            .slug(course.getSlug())
                            .shortDescription(course.getShortDescription())
                            .description(course.getDescription())
                            .level(course.getLevel())
                            .duration(course.getDuration())
                            .thumbnailUrl(course.getThumbnail())
                            .categoryId(categoryId)
                            .categoryName(categoryName)
                            .isActive(course.isActive())
                            .isPublished(course.isActive())
                            .createdAt(course.getCreatedAt())
                            .updatedAt(course.getUpdatedAt())
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }
}
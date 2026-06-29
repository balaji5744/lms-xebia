package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.category.repository.CategoryRepository;
import com.geeknito.geeknito_backend.course.dto.CourseRequestDTO;
import com.geeknito.geeknito_backend.course.dto.CourseResponseDTO;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseAdminServiceImpl implements CourseAdminService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CourseResponseDTO create(CourseRequestDTO requestDTO) {

        log.info("Creating course: {}", requestDTO.getTitle());

        CategoryEntity category = null;
        if (requestDTO.getCategoryId() != null) {
            category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Category not found with ID: " + requestDTO.getCategoryId()));
        }

        CourseEntity entity = CourseEntity.builder()
                .title(requestDTO.getTitle())
                .slug(requestDTO.getSlug())
                .thumbnail(requestDTO.getThumbnailUrl())
                .shortDescription(requestDTO.getShortDescription())
                .description(requestDTO.getDescription())
                .level(requestDTO.getLevel())
                .duration(requestDTO.getDuration())
                .category(category)
                .isActive(true)
                .build();

        CourseEntity saved = courseRepository.save(entity);

        log.info("Course created successfully with ID: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CourseResponseDTO update(Long id, CourseRequestDTO requestDTO) {

        log.info("Updating course with ID: {}", id);

        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Course not found with ID: " + id));

        CategoryEntity category = null;
        if (requestDTO.getCategoryId() != null) {
            category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Category not found with ID: " + requestDTO.getCategoryId()));
        }

        entity.setTitle(requestDTO.getTitle());
        entity.setSlug(requestDTO.getSlug());
        entity.setThumbnail(requestDTO.getThumbnailUrl());
        entity.setShortDescription(requestDTO.getShortDescription());
        entity.setDescription(requestDTO.getDescription());
        entity.setLevel(requestDTO.getLevel());
        entity.setDuration(requestDTO.getDuration());
        entity.setCategory(category);

        CourseEntity updated = courseRepository.save(entity);

        log.info("Course updated successfully with ID: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void softDelete(Long id) {

        log.warn("Soft deleting course with ID: {}", id);

        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Course not found with ID: " + id));

        entity.setActive(false);
        courseRepository.save(entity);

        log.info("Course marked as inactive with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponseDTO getById(Long id) {

        log.debug("Fetching course with ID: {}", id);

        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Course not found with ID: " + id));

        return mapToResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAll() {

        log.debug("Fetching all courses");

        return courseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CourseResponseDTO mapToResponse(CourseEntity entity) {
        if (entity == null) {
            return null;
        }

        Long categoryId = entity.getCategory() != null ? entity.getCategory().getId() : null;
        String categoryName = entity.getCategory() != null ? entity.getCategory().getName() : null;

        return CourseResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .shortDescription(entity.getShortDescription())
                .description(entity.getDescription())
                .level(entity.getLevel())
                .duration(entity.getDuration())
                .thumbnailUrl(entity.getThumbnail())
                .categoryId(categoryId)
                .categoryName(categoryName)
                .isActive(entity.isActive())
                .isPublished(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
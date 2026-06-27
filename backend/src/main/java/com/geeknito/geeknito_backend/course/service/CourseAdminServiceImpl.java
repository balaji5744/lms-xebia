package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.category.repository.CategoryRepository;
import com.geeknito.geeknito_backend.course.dto.CourseRequestDTO;
import com.geeknito.geeknito_backend.course.dto.CourseResponseDTO;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import com.geeknito.geeknito_backend.entity.learning.CourseEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseAdminServiceImpl implements CourseAdminService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CourseResponseDTO create(CourseRequestDTO requestDTO) {
        CategoryEntity category = null;
        if (requestDTO.getCategoryId() != null) {
            category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + requestDTO.getCategoryId()));
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
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CourseResponseDTO update(Long id, CourseRequestDTO requestDTO) {
        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + id));

        CategoryEntity category = null;
        if (requestDTO.getCategoryId() != null) {
            category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + requestDTO.getCategoryId()));
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
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void softDelete(Long id) {
        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + id));

        entity.setActive(false);
        courseRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponseDTO getById(Long id) {
        CourseEntity entity = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with ID: " + id));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAll() {
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
                .isPublished(entity.isActive()) // Default/fallback mapping
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

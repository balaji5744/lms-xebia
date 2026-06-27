package com.geeknito.geeknito_backend.category.service;

import com.geeknito.geeknito_backend.category.dto.CategoryRequestDTO;
import com.geeknito.geeknito_backend.category.dto.CategoryResponseDTO;
import com.geeknito.geeknito_backend.category.repository.CategoryRepository;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryAdminServiceImpl implements CategoryAdminService {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO requestDTO) {
        CategoryEntity entity = CategoryEntity.builder()
                .name(requestDTO.getName())
                .icon(requestDTO.getIcon())
                .description(requestDTO.getDescription())
                .color(requestDTO.getColor())
                .isActive(requestDTO.getActive() != null ? requestDTO.getActive() : true)
                .build();

        CategoryEntity saved = categoryRepository.save(entity);
        CategoryResponseDTO dto = mapToResponse(saved);
        dto.setCourseCount(0L);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDTO getById(Long id) {
        Object[] result = categoryRepository.findByIdWithCourseCount(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + id));
        CategoryEntity entity = (CategoryEntity) result[0];
        Long count = (Long) result[1];
        CategoryResponseDTO dto = mapToResponse(entity);
        dto.setCourseCount(count != null ? count : 0L);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAll() {
        return categoryRepository.findAllWithCourseCount().stream()
                .map(result -> {
                    CategoryEntity entity = (CategoryEntity) result[0];
                    Long count = (Long) result[1];
                    CategoryResponseDTO dto = mapToResponse(entity);
                    dto.setCourseCount(count != null ? count : 0L);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponseDTO update(Long id, CategoryRequestDTO requestDTO) {
        CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + id));

        entity.setName(requestDTO.getName());
        entity.setIcon(requestDTO.getIcon());
        entity.setDescription(requestDTO.getDescription());
        entity.setColor(requestDTO.getColor());
        
        if (requestDTO.getActive() != null) {
            entity.setActive(requestDTO.getActive());
        }

        CategoryEntity updated = categoryRepository.save(entity);
        long count = courseRepository.countByCategoryId(id);
        CategoryResponseDTO dto = mapToResponse(updated);
        dto.setCourseCount(count);
        return dto;
    }

    @Override
    @Transactional
    public void softDelete(Long id) {
        CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + id));

        entity.setActive(false);
        categoryRepository.save(entity);
    }

    private CategoryResponseDTO mapToResponse(CategoryEntity entity) {
        // 1. Build the DTO without the active field to bypass the Builder cache
        CategoryResponseDTO dto = CategoryResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .description(entity.getDescription())
                .color(entity.getColor())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .courseCount(0L)
                .build();

        // 2. Set the active field using the standard setter
        dto.setActive(entity.isActive());

        return dto;
    }
}

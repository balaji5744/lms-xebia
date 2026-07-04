package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import com.geeknito.geeknito_backend.course.mapper.CourseMapper;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseCatalogServiceImpl implements CourseCatalogService {

    private final CourseRepository courseRepository;
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
    @Cacheable(value = "course-details", key = "#slug")
    public CourseCatalogDetailDTO getCourseDetailBySlug(String slug) {
        log.info("Fetching public course detail by slug: {}", slug);
        return courseRepository.findCourseDetailBySlug(slug)
                .map(courseMapper::toCatalogDetailDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with slug: " + slug));
    }
}
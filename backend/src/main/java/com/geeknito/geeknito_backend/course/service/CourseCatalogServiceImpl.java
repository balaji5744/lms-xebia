package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import com.geeknito.geeknito_backend.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseCatalogServiceImpl implements CourseCatalogService {

    private final CourseRepository courseRepository;

    @Override
    public Page<CourseCatalogCardDTO> getCatalogCourses(Pageable pageable) {
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
    public CourseCatalogDetailDTO getCourseDetailBySlug(String slug) {
        // We will test the catalog grid first, so we'll leave this empty for just a moment!
        return null;
    }
}
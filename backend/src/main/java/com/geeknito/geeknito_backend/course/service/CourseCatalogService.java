package com.geeknito.geeknito_backend.course.service;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CourseCatalogService {
    
    Page<CourseCatalogCardDTO> getCatalogCourses(Pageable pageable);

    CourseCatalogDetailDTO getCourseDetailBySlug(String slug);
}

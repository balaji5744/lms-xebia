package com.geeknito.geeknito_backend.course.controller;

import com.geeknito.geeknito_backend.course.dto.CourseCatalogCardDTO;
import com.geeknito.geeknito_backend.course.dto.CourseCatalogDetailDTO;
import com.geeknito.geeknito_backend.course.service.CourseCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/catalog/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseCatalogController {

    private final CourseCatalogService courseCatalogService;

    @GetMapping
    public ResponseEntity<Page<CourseCatalogCardDTO>> getCatalogCourses(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CourseCatalogCardDTO> catalogPage = courseCatalogService.getCatalogCourses(pageable);
        return ResponseEntity.ok(catalogPage);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CourseCatalogDetailDTO> getCourseDetailBySlug(@PathVariable String slug) {
        CourseCatalogDetailDTO courseDetail = courseCatalogService.getCourseDetailBySlug(slug);
        return ResponseEntity.ok(courseDetail);
    }
}

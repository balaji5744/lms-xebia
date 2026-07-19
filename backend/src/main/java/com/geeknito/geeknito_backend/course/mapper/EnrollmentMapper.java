package com.geeknito.geeknito_backend.course.mapper;

import com.geeknito.geeknito_backend.course.dto.EnrollmentResponseDTO;
import com.geeknito.geeknito_backend.entity.learning.EnrollmentEntity;

public class EnrollmentMapper {

    public static EnrollmentResponseDTO toResponseDTO(EnrollmentEntity entity) {
        return toResponseDTO(entity, null);
    }

    public static EnrollmentResponseDTO toResponseDTO(EnrollmentEntity entity, String instructorName) {
        if (entity == null) {
            return null;
        }

        return EnrollmentResponseDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudent() != null ? entity.getStudent().getId() : null)
                .studentName(entity.getStudent() != null ? entity.getStudent().getFullName() : null)
                .studentEmail(entity.getStudent() != null ? entity.getStudent().getEmail() : null)
                .courseId(entity.getCourse() != null ? entity.getCourse().getId() : null)
                .courseTitle(entity.getCourse() != null ? entity.getCourse().getTitle() : null)
                .courseSlug(entity.getCourse() != null ? entity.getCourse().getSlug() : null)
                .status(entity.getStatus())
                .progressPercentage(entity.getProgressPercentage())
                .enrolledAt(entity.getEnrolledAt())
                .lastAccessedAt(entity.getLastAccessedAt())
                .completedAt(entity.getCompletedAt())
                .courseThumbnail(entity.getCourse() != null ? entity.getCourse().getThumbnail() : null)
                .courseCategoryName(entity.getCourse() != null && entity.getCourse().getCategory() != null ? entity.getCourse().getCategory().getName() : null)
                .instructorName(instructorName != null ? instructorName : "EduCorp Instructor")
                .build();
    }
}

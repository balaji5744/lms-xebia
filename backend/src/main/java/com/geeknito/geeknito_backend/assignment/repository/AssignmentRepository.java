package com.geeknito.geeknito_backend.assignment.repository;

import com.geeknito.geeknito_backend.entity.learning.AssignmentEntity;
import com.geeknito.geeknito_backend.entity.learning.AssignmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {

    @Override
    @EntityGraph(attributePaths = {"course", "teacher"})
    Optional<AssignmentEntity> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"course", "teacher"})
    List<AssignmentEntity> findAll();

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<AssignmentEntity> findByCourseId(Long courseId);

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<AssignmentEntity> findByTeacherId(Long teacherId);

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<AssignmentEntity> findByStatus(AssignmentStatus status);

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<AssignmentEntity> findByIsActiveTrue();

    boolean existsByTitleAndCourseId(String title, Long courseId);
}

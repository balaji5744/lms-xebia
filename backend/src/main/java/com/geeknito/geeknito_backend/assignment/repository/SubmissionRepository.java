package com.geeknito.geeknito_backend.assignment.repository;

import com.geeknito.geeknito_backend.entity.learning.SubmissionEntity;
import com.geeknito.geeknito_backend.entity.learning.SubmissionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long> {

    @Override
    @EntityGraph(attributePaths = {"assignment", "student"})
    Optional<SubmissionEntity> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"assignment", "student"})
    List<SubmissionEntity> findAll();

    @EntityGraph(attributePaths = {"assignment", "student"})
    List<SubmissionEntity> findByAssignmentId(Long assignmentId);

    @EntityGraph(attributePaths = {"assignment", "student"})
    List<SubmissionEntity> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"assignment", "student"})
    List<SubmissionEntity> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

    boolean existsByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    long countByAssignmentIdAndStudentIdAndStatusNot(Long assignmentId, Long studentId, SubmissionStatus status);
    boolean existsByAssignmentIdAndStudentIdAndStatus(Long assignmentId, Long studentId, SubmissionStatus status);

    @EntityGraph(attributePaths = {"assignment", "student"})
    List<SubmissionEntity> findByStatus(SubmissionStatus status);
}

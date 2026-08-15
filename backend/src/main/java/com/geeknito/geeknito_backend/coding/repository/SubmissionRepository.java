package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.SubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long> {
    List<SubmissionEntity> findByProblemIdAndStudentIdOrderBySubmittedAtDesc(Long problemId, String studentId);
    List<SubmissionEntity> findByStudentIdOrderBySubmittedAtDesc(String studentId);
}

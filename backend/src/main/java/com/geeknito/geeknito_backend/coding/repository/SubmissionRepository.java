package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.CodingSubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<CodingSubmissionEntity, Long> {
    List<CodingSubmissionEntity> findByProblemIdAndStudentIdOrderBySubmittedAtDesc(Long problemId, String studentId);
    List<CodingSubmissionEntity> findByStudentIdOrderBySubmittedAtDesc(String studentId);
}

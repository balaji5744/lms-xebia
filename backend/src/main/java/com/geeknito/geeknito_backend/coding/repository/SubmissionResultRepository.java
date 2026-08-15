package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.SubmissionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionResultRepository extends JpaRepository<SubmissionResultEntity, Long> {
    List<SubmissionResultEntity> findBySubmissionId(Long submissionId);
}

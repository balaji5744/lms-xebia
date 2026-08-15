package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCaseEntity, Long> {
    List<TestCaseEntity> findByProblemIdOrderByTestOrderAsc(Long problemId);
    List<TestCaseEntity> findByProblemIdAndIsHiddenOrderByTestOrderAsc(Long problemId, boolean isHidden);
}

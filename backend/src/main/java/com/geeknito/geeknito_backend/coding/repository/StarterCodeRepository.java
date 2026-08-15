package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.StarterCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StarterCodeRepository extends JpaRepository<StarterCodeEntity, Long> {
    List<StarterCodeEntity> findByProblemId(Long problemId);
    Optional<StarterCodeEntity> findByProblemIdAndLanguage(Long problemId, String language);
}

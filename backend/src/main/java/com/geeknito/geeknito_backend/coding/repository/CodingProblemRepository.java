package com.geeknito.geeknito_backend.coding.repository;

import com.geeknito.geeknito_backend.entity.learning.CodingProblemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodingProblemRepository extends JpaRepository<CodingProblemEntity, Long> {
    Optional<CodingProblemEntity> findByContentId(Long contentId);
}

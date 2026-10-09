package com.geeknito.geeknito_backend.batch.repository;

import com.geeknito.geeknito_backend.entity.learning.BatchEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<BatchEntity, Long> {

    @Override
    @EntityGraph(attributePaths = {"course", "teacher"})
    Optional<BatchEntity> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"course", "teacher"})
    List<BatchEntity> findAll();

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<BatchEntity> findByCourseId(Long courseId);

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<BatchEntity> findByTeacherId(Long teacherId);

    boolean existsByNameAndCourseId(String name, Long courseId);
    boolean existsByCourseIdAndName(Long courseId, String name);

    @EntityGraph(attributePaths = {"course", "teacher"})
    List<BatchEntity> findByIsActiveTrue();

    @EntityGraph(attributePaths = {"course", "teacher"})
    Optional<BatchEntity> findByBatchCode(String batchCode);

    boolean existsByBatchCode(String batchCode);
}

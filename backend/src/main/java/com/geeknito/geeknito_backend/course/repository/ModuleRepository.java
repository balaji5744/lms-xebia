package com.geeknito.geeknito_backend.course.repository;

import com.geeknito.geeknito_backend.entity.learning.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {
    List<ModuleEntity> findByCourseIdOrderByModuleOrderAsc(Long courseId);

    @Query("SELECT DISTINCT m FROM ModuleEntity m " +
           "LEFT JOIN FETCH m.submodules s " +
           "WHERE m.course.id = :courseId " +
           "ORDER BY m.moduleOrder ASC")
    List<ModuleEntity> findModulesWithSubmodulesByCourseId(@Param("courseId") Long courseId);
}

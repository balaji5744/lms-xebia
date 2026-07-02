package com.geeknito.geeknito_backend.category.repository;

import com.geeknito.geeknito_backend.entity.learning.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    
    List<CategoryEntity> findByIsActiveTrue();

    @Query("SELECT c, (SELECT COUNT(co) FROM CourseEntity co WHERE co.category = c) " +
           "FROM CategoryEntity c WHERE c.isActive = true")
    List<Object[]> findByIsActiveTrueWithCourseCount();

    @Query("SELECT c, (SELECT COUNT(co) FROM CourseEntity co WHERE co.category = c) " +
           "FROM CategoryEntity c")
    List<Object[]> findAllWithCourseCount();

    @Query("SELECT c, (SELECT COUNT(co) FROM CourseEntity co WHERE co.category = c) " +
           "FROM CategoryEntity c WHERE c.id = :id")
    Optional<Object[]> findByIdWithCourseCount(@Param("id") Long id);
}

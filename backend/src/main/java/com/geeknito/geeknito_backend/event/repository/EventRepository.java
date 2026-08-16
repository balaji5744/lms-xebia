package com.geeknito.geeknito_backend.event.repository;

import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long>, JpaSpecificationExecutor<EventEntity> {

    Optional<EventEntity> findBySlug(String slug);

    Page<EventEntity> findByStatus(EventStatus status, Pageable pageable);

    List<EventEntity> findByStatus(EventStatus status);

    Page<EventEntity> findByCreatedBy(UserEntity createdBy, Pageable pageable);

    long countByStatus(EventStatus status);

    long countByCreatedById(Long createdById);

    long countByStatusAndCreatedById(EventStatus status, Long createdById);

    @Query("SELECT e FROM EventEntity e WHERE e.status = 'PUBLISHED' AND e.startDate > :now AND (:creatorId IS NULL OR e.createdBy.id = :creatorId) ORDER BY e.startDate ASC")
    List<EventEntity> findUpcomingEvents(@Param("now") LocalDateTime now, @Param("creatorId") Long creatorId);

    @Query("SELECT e FROM EventEntity e WHERE (e.status = 'COMPLETED' OR (e.status = 'PUBLISHED' AND e.endDate < :now)) AND (:creatorId IS NULL OR e.createdBy.id = :creatorId) ORDER BY e.endDate DESC")
    List<EventEntity> findCompletedEvents(@Param("now") LocalDateTime now, @Param("creatorId") Long creatorId);

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE e.status = 'PUBLISHED' AND e.startDate > :now AND (:creatorId IS NULL OR e.createdBy.id = :creatorId)")
    long countUpcomingEvents(@Param("now") LocalDateTime now, @Param("creatorId") Long creatorId);

    @Query("SELECT COUNT(e) FROM EventEntity e WHERE (e.status = 'COMPLETED' OR (e.status = 'PUBLISHED' AND e.endDate < :now)) AND (:creatorId IS NULL OR e.createdBy.id = :creatorId)")
    long countCompletedEvents(@Param("now") LocalDateTime now, @Param("creatorId") Long creatorId);
}

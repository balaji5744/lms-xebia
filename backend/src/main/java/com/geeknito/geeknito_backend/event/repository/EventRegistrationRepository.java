package com.geeknito.geeknito_backend.event.repository;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistrationEntity, Long> {

    boolean existsByEventIdAndStudentId(Long eventId, Long studentId);

    Optional<EventRegistrationEntity> findByEventIdAndStudentId(Long eventId, Long studentId);

    Optional<EventRegistrationEntity> findByEventSlugAndStudentId(String slug, Long studentId);

    List<EventRegistrationEntity> findByEventId(Long eventId);

    Page<EventRegistrationEntity> findByEventId(Long eventId, Pageable pageable);

    List<EventRegistrationEntity> findByStudentId(Long studentId);

    long countByEventId(Long eventId);

    long countByStudentId(Long studentId);

    long countByAttendanceStatus(AttendanceStatus attendanceStatus);

    long countByCertificateIssuedTrue();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(r) FROM EventRegistrationEntity r WHERE :creatorId IS NULL OR r.event.createdBy.id = :creatorId")
    long countByEventCreatedById(@org.springframework.data.repository.query.Param("creatorId") Long creatorId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(r) FROM EventRegistrationEntity r WHERE r.attendanceStatus = :status AND (:creatorId IS NULL OR r.event.createdBy.id = :creatorId)")
    long countByAttendanceStatusAndEventCreatedById(@org.springframework.data.repository.query.Param("status") AttendanceStatus status, @org.springframework.data.repository.query.Param("creatorId") Long creatorId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(r) FROM EventRegistrationEntity r WHERE r.certificateIssued = true AND (:creatorId IS NULL OR r.event.createdBy.id = :creatorId)")
    long countByCertificateIssuedTrueAndEventCreatedById(@org.springframework.data.repository.query.Param("creatorId") Long creatorId);
}

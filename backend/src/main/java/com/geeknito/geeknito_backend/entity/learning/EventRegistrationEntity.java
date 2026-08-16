package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "event_registrations",
    uniqueConstraints = @UniqueConstraint(name = "uq_event_student", columnNames = {"event_id", "student_id"}),
    indexes = {
        @Index(name = "idx_event_registrations_event", columnList = "event_id"),
        @Index(name = "idx_event_registrations_student", columnList = "student_id"),
        @Index(name = "idx_event_registrations_event_student", columnList = "event_id, student_id")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"event", "student"})
public class EventRegistrationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Event is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private EventEntity event;

    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private UserEntity student;

    @CreationTimestamp
    @Column(name = "registered_at", nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    @NotNull(message = "Attendance status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false, length = 50)
    private AttendanceStatus attendanceStatus;

    @Column(name = "certificate_issued", nullable = false)
    @Builder.Default
    private boolean certificateIssued = false;

    @Column(name = "certificate_issued_at")
    private LocalDateTime certificateIssuedAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

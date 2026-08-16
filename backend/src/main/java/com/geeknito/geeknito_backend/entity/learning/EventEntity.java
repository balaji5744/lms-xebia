package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "events",
    uniqueConstraints = @UniqueConstraint(name = "uq_events_slug", columnNames = {"slug"}),
    indexes = {
        @Index(name = "idx_events_slug", columnList = "slug"),
        @Index(name = "idx_events_status", columnList = "status"),
        @Index(name = "idx_events_start_date", columnList = "start_date"),
        @Index(name = "idx_events_registration_deadline", columnList = "registration_deadline"),
        @Index(name = "idx_events_location_mode", columnList = "location_mode")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"createdBy", "registrations"})
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Slug is required")
    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "banner_url", columnDefinition = "TEXT")
    private String bannerUrl;

    @Column(name = "banner_file_name")
    private String bannerFileName;

    @NotNull(message = "Location mode is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "location_mode", nullable = false, length = 50)
    private EventMode locationMode;

    @Column
    private String venue;

    @Column(name = "meeting_link", columnDefinition = "TEXT")
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    @Column(name = "meeting_provider", length = 50)
    private MeetingProvider meetingProvider;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @NotNull(message = "Registration deadline is required")
    @Column(name = "registration_deadline", nullable = false)
    private LocalDateTime registrationDeadline;

    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private int capacity;

    @Min(value = 0, message = "Registered count cannot be negative")
    @Column(name = "registered_count", nullable = false)
    @Builder.Default
    private int registeredCount = 0;

    @NotBlank(message = "Organizer name is required")
    @Column(name = "organizer_name", nullable = false)
    private String organizerName;

    @NotBlank(message = "Organizer email is required")
    @Email(message = "Organizer email must be valid")
    @Column(name = "organizer_email", nullable = false)
    private String organizerEmail;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EventStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private UserEntity createdBy;

    @Version
    private Long version;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EventRegistrationEntity> registrations = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

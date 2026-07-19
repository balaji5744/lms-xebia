package com.geeknito.geeknito_backend.event.dto;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.entity.learning.MeetingProvider;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String bannerUrl;
    private String bannerFileName;
    private EventMode locationMode;
    private String venue;
    private String meetingLink;
    private MeetingProvider meetingProvider;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationDeadline;
    private int capacity;
    private int registeredCount;
    private String organizerName;
    private String organizerEmail;
    private EventStatus status;
    private Long createdById;
    private String createdByName;
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<EventRegistrationDTO> registrations;
}

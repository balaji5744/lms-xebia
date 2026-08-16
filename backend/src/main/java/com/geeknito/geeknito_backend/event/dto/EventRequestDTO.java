package com.geeknito.geeknito_backend.event.dto;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.entity.learning.MeetingProvider;
import jakarta.validation.constraints.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequestDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String bannerUrl;
    private String bannerFileName;

    @NotNull(message = "Location mode is required")
    private EventMode locationMode;

    private String venue;
    private String meetingLink;
    private MeetingProvider meetingProvider;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotNull(message = "Registration deadline is required")
    private LocalDateTime registrationDeadline;

    @Positive(message = "Capacity must be greater than 0")
    private int capacity;

    @NotBlank(message = "Organizer name is required")
    private String organizerName;

    @NotBlank(message = "Organizer email is required")
    @Email(message = "Organizer email must be valid")
    private String organizerEmail;

    @NotNull(message = "Status is required")
    private EventStatus status;
}

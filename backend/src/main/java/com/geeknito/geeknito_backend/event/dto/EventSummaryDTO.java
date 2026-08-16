package com.geeknito.geeknito_backend.event.dto;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSummaryDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String bannerUrl;
    private EventMode locationMode;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationDeadline;
    private int capacity;
    private int registeredCount;
    private EventStatus status;
    private String organizerName;
}

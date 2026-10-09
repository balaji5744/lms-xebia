package com.geeknito.geeknito_backend.event.dto;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventSlug;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private LocalDateTime registeredAt;
    private AttendanceStatus attendanceStatus;
    private boolean certificateIssued;
    private LocalDateTime certificateIssuedAt;
    private String remarks;
}

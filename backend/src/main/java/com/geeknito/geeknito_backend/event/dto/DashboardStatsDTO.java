package com.geeknito.geeknito_backend.event.dto;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long cancelledEvents;
    private long draftEvents;
    private long totalRegistrations;
    private double attendanceRate;
    private long certificatesIssued;
}

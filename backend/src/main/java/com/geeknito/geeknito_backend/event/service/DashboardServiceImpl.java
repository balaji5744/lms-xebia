package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.event.dto.DashboardStatsDTO;
import com.geeknito.geeknito_backend.event.repository.EventRegistrationRepository;
import com.geeknito.geeknito_backend.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats(Long creatorId) {
        log.info("Calculating event dashboard stats, creatorId={}", creatorId);
        LocalDateTime now = LocalDateTime.now();

        long totalEvents;
        long upcomingEvents = eventRepository.countUpcomingEvents(now, creatorId);
        long completedEvents = eventRepository.countCompletedEvents(now, creatorId);
        long cancelledEvents;
        long draftEvents;

        if (creatorId == null) {
            totalEvents = eventRepository.count();
            cancelledEvents = eventRepository.countByStatus(EventStatus.CANCELLED);
            draftEvents = eventRepository.countByStatus(EventStatus.DRAFT);
        } else {
            totalEvents = eventRepository.countByCreatedById(creatorId);
            cancelledEvents = eventRepository.countByStatusAndCreatedById(EventStatus.CANCELLED, creatorId);
            draftEvents = eventRepository.countByStatusAndCreatedById(EventStatus.DRAFT, creatorId);
        }

        long totalRegistrations = eventRegistrationRepository.countByEventCreatedById(creatorId);
        long attendedCount = eventRegistrationRepository.countByAttendanceStatusAndEventCreatedById(AttendanceStatus.ATTENDED, creatorId);
        long checkedInCount = eventRegistrationRepository.countByAttendanceStatusAndEventCreatedById(AttendanceStatus.CHECKED_IN, creatorId);

        double attendanceRate = 0.0;
        if (totalRegistrations > 0) {
            attendanceRate = ((double) (attendedCount + checkedInCount) / totalRegistrations) * 100.0;
        }

        long certificatesIssued = eventRegistrationRepository.countByCertificateIssuedTrueAndEventCreatedById(creatorId);

        return DashboardStatsDTO.builder()
                .totalEvents(totalEvents)
                .upcomingEvents(upcomingEvents)
                .completedEvents(completedEvents)
                .cancelledEvents(cancelledEvents)
                .draftEvents(draftEvents)
                .totalRegistrations(totalRegistrations)
                .attendanceRate(attendanceRate)
                .certificatesIssued(certificatesIssued)
                .build();
    }
}

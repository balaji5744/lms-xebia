package com.geeknito.geeknito_backend.event.mapper;

import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import com.geeknito.geeknito_backend.event.dto.EventRegistrationDTO;
import com.geeknito.geeknito_backend.event.dto.EventResponseDTO;
import com.geeknito.geeknito_backend.event.dto.EventSummaryDTO;

import java.util.Collections;
import java.util.stream.Collectors;

public class EventMapper {

    public static EventResponseDTO toResponseDTO(EventEntity entity) {
        if (entity == null) {
            return null;
        }

        return EventResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .bannerUrl(entity.getBannerUrl())
                .bannerFileName(entity.getBannerFileName())
                .locationMode(entity.getLocationMode())
                .venue(entity.getVenue())
                .meetingLink(entity.getMeetingLink())
                .meetingProvider(entity.getMeetingProvider())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .registrationDeadline(entity.getRegistrationDeadline())
                .capacity(entity.getCapacity())
                .registeredCount(entity.getRegisteredCount())
                .organizerName(entity.getOrganizerName())
                .organizerEmail(entity.getOrganizerEmail())
                .status(entity.getStatus())
                .createdById(entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null)
                .createdByName(entity.getCreatedBy() != null ? entity.getCreatedBy().getFullName() : null)
                .version(entity.getVersion())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .registrations(entity.getRegistrations() != null ? 
                        entity.getRegistrations().stream()
                                .map(EventMapper::toRegistrationDTO)
                                .collect(Collectors.toList()) : Collections.emptyList())
                .build();
    }

    public static EventSummaryDTO toSummaryDTO(EventEntity entity) {
        if (entity == null) {
            return null;
        }

        return EventSummaryDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .bannerUrl(entity.getBannerUrl())
                .locationMode(entity.getLocationMode())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .registrationDeadline(entity.getRegistrationDeadline())
                .capacity(entity.getCapacity())
                .registeredCount(entity.getRegisteredCount())
                .status(entity.getStatus())
                .organizerName(entity.getOrganizerName())
                .build();
    }

    public static EventRegistrationDTO toRegistrationDTO(EventRegistrationEntity entity) {
        if (entity == null) {
            return null;
        }

        return EventRegistrationDTO.builder()
                .id(entity.getId())
                .eventId(entity.getEvent() != null ? entity.getEvent().getId() : null)
                .eventTitle(entity.getEvent() != null ? entity.getEvent().getTitle() : null)
                .eventSlug(entity.getEvent() != null ? entity.getEvent().getSlug() : null)
                .studentId(entity.getStudent() != null ? entity.getStudent().getId() : null)
                .studentName(entity.getStudent() != null ? entity.getStudent().getFullName() : null)
                .studentEmail(entity.getStudent() != null ? entity.getStudent().getEmail() : null)
                .registeredAt(entity.getRegisteredAt())
                .attendanceStatus(entity.getAttendanceStatus())
                .certificateIssued(entity.isCertificateIssued())
                .certificateIssuedAt(entity.getCertificateIssuedAt())
                .remarks(entity.getRemarks())
                .build();
    }
}

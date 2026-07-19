package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import com.geeknito.geeknito_backend.event.dto.ExportRegistrationDTO;
import com.geeknito.geeknito_backend.event.dto.ExportRowDTO;
import com.geeknito.geeknito_backend.event.repository.EventRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventExportServiceImpl implements EventExportService {

    private final EventRegistrationRepository eventRegistrationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExportRegistrationDTO> getExportRegistrations(Long eventId) {
        log.info("Generating export registration DTOs for event ID: {}", eventId);
        List<EventRegistrationEntity> registrations = eventRegistrationRepository.findByEventId(eventId);
        return registrations.stream()
                .map(reg -> ExportRegistrationDTO.builder()
                        .studentName(reg.getStudent() != null ? reg.getStudent().getFullName() : "Unknown")
                        .studentEmail(reg.getStudent() != null ? reg.getStudent().getEmail() : "")
                        .registeredAt(reg.getRegisteredAt())
                        .attendanceStatus(reg.getAttendanceStatus() != null ? reg.getAttendanceStatus().name() : "REGISTERED")
                        .certificateIssued(reg.isCertificateIssued())
                        .remarks(reg.getRemarks())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExportRowDTO> getExportRows(Long eventId) {
        log.info("Generating export row DTOs for event ID: {}", eventId);
        List<EventRegistrationEntity> registrations = eventRegistrationRepository.findByEventId(eventId);
        return registrations.stream()
                .map(reg -> ExportRowDTO.builder()
                        .studentName(reg.getStudent() != null ? reg.getStudent().getFullName() : "Unknown")
                        .studentEmail(reg.getStudent() != null ? reg.getStudent().getEmail() : "")
                        .registeredAt(reg.getRegisteredAt())
                        .attendanceStatus(reg.getAttendanceStatus() != null ? reg.getAttendanceStatus().name() : "REGISTERED")
                        .certificateIssued(reg.isCertificateIssued())
                        .remarks(reg.getRemarks())
                        .build())
                .collect(Collectors.toList());
    }
}

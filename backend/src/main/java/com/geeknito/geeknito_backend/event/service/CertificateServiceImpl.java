package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import com.geeknito.geeknito_backend.event.dto.CertificateDTO;
import com.geeknito.geeknito_backend.event.repository.EventRegistrationRepository;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final EventRegistrationRepository eventRegistrationRepository;

    @Override
    @Transactional
    public CertificateDTO issueCertificate(Long registrationId) {
        log.info("Attempting to issue certificate for registration ID: {}", registrationId);

        EventRegistrationEntity registration = eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (registration.getAttendanceStatus() != AttendanceStatus.ATTENDED) {
            throw new IllegalStateException("Certificate can only be issued when attendance status is ATTENDED");
        }

        registration.setCertificateIssued(true);
        registration.setCertificateIssuedAt(LocalDateTime.now());
        EventRegistrationEntity saved = eventRegistrationRepository.save(registration);

        log.info("Certificate successfully issued for registration ID: {}", registrationId);
        return CertificateDTO.builder()
                .id(saved.getId())
                .registrationId(saved.getId())
                .eventTitle(saved.getEvent() != null ? saved.getEvent().getTitle() : "Unknown Event")
                .studentName(saved.getStudent() != null ? saved.getStudent().getFullName() : "Unknown Student")
                .studentEmail(saved.getStudent() != null ? saved.getStudent().getEmail() : "")
                .issuedAt(saved.getCertificateIssuedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateDTO> getCertificatesForStudent(Long studentId) {
        log.info("Retrieving certificates for student ID: {}", studentId);
        return eventRegistrationRepository.findByStudentId(studentId).stream()
                .filter(EventRegistrationEntity::isCertificateIssued)
                .map(reg -> CertificateDTO.builder()
                        .id(reg.getId())
                        .registrationId(reg.getId())
                        .eventTitle(reg.getEvent() != null ? reg.getEvent().getTitle() : "Unknown Event")
                        .studentName(reg.getStudent() != null ? reg.getStudent().getFullName() : "Unknown Student")
                        .studentEmail(reg.getStudent() != null ? reg.getStudent().getEmail() : "")
                        .issuedAt(reg.getCertificateIssuedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

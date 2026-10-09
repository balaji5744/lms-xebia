package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.AttendanceUpdateDTO;
import com.geeknito.geeknito_backend.event.dto.CertificateDTO;
import com.geeknito.geeknito_backend.event.dto.EventRegistrationDTO;
import com.geeknito.geeknito_backend.event.repository.EventRegistrationRepository;
import com.geeknito.geeknito_backend.event.service.CertificateService;
import com.geeknito.geeknito_backend.event.service.RegistrationService;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@Slf4j
@RestController
@RequestMapping("/admin/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Attendance & Certificates", description = "Attendance and certificate management APIs")
public class AttendanceController {

    private final RegistrationService registrationService;
    private final CertificateService certificateService;
    private final EventRegistrationRepository eventRegistrationRepository;

    private UserEntity getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException("Full authentication is required to access this resource.");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserEntity) {
            return (UserEntity) principal;
        }
        throw new AuthenticationException("User session is invalid or expired. Please log in again.");
    }

    @PutMapping("/{id}/attendance")
    @Operation(summary = "Update attendance status", description = "Mark or update attendance status for an event registration. Open to ADMIN and TEACHER (Teachers restricted to their own events).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated attendance"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Registration not found")
    })
    public ResponseEntity<EventRegistrationDTO> updateAttendance(
            @PathVariable("id") Long registrationId,
            @Valid @RequestBody AttendanceUpdateDTO dto) {

        UserEntity user = getAuthenticatedUser();
        log.info("REST: Update attendance for registration ID {} requested by user ID {}", registrationId, user.getId());

        EventRegistrationEntity registration = eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // RBAC Check: Teachers may only update attendance for their own events
        if (user.getRole().equalsIgnoreCase("teacher")) {
            Long eventCreatorId = registration.getEvent().getCreatedBy() != null ? registration.getEvent().getCreatedBy().getId() : null;
            if (eventCreatorId == null || !eventCreatorId.equals(user.getId())) {
                throw new AccessDeniedException("You are not authorized to mark attendance for this event.");
            }
        }

        EventRegistrationDTO updated = registrationService.updateAttendance(registrationId, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/certificate")
    @Operation(summary = "Issue a certificate", description = "Issue a certificate to a student who attended the event. Open to ADMIN and TEACHER (Teachers restricted to their own events).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully issued certificate"),
        @ApiResponse(responseCode = "400", description = "Certificate requirement not met (e.g., student did not attend)"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Registration not found")
    })
    public ResponseEntity<CertificateDTO> issueCertificate(@PathVariable("id") Long registrationId) {
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Issue certificate for registration ID {} requested by user ID {}", registrationId, user.getId());

        EventRegistrationEntity registration = eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // RBAC Check: Teachers may only issue certificates for their own events
        if (user.getRole().equalsIgnoreCase("teacher")) {
            Long eventCreatorId = registration.getEvent().getCreatedBy() != null ? registration.getEvent().getCreatedBy().getId() : null;
            if (eventCreatorId == null || !eventCreatorId.equals(user.getId())) {
                throw new AccessDeniedException("You are not authorized to issue certificates for this event.");
            }
        }

        try {
            CertificateDTO certificate = certificateService.issueCertificate(registrationId);
            return ResponseEntity.ok(certificate);
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}

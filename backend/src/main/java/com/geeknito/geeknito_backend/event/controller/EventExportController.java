package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.ExportRowDTO;
import com.geeknito.geeknito_backend.event.repository.EventRepository;
import com.geeknito.geeknito_backend.event.service.EventExportService;
import com.geeknito.geeknito_backend.event.util.EventExcelGenerator;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Export", description = "Excel export APIs for events")
public class EventExportController {

    private final EventExportService eventExportService;
    private final EventRepository eventRepository;

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

    @GetMapping("/{id}/registrations/export")
    @Operation(summary = "Export registrations to Excel", description = "Generate and download a stylized Excel spreadsheet of all student registrations, attendance, and certificates for the event. Open to ADMIN and TEACHER (Teachers restricted to their own events).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully generated and returned Excel sheet"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error generating export")
    })
    public ResponseEntity<InputStreamResource> exportRegistrations(@PathVariable("id") Long eventId) {
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Export registrations for event ID {} requested by user ID {}", eventId, user.getId());

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        // RBAC Check: Teachers may only export their own events
        if (user.getRole().equalsIgnoreCase("teacher")) {
            Long eventCreatorId = event.getCreatedBy() != null ? event.getCreatedBy().getId() : null;
            if (eventCreatorId == null || !eventCreatorId.equals(user.getId())) {
                throw new AccessDeniedException("You are not authorized to export data for this event.");
            }
        }

        try {
            List<ExportRowDTO> rows = eventExportService.getExportRows(eventId);
            ByteArrayInputStream bis = EventExcelGenerator.generateEventRegistrationsExport(event, rows);

            String sanitizedEventTitle = event.getTitle().replaceAll("[\\\\/:*?\"<>|]", "_");
            String filename = "Event_" + sanitizedEventTitle + "_Registrations.xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=\"" + filename + "\"");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(bis));
        } catch (IOException e) {
            log.error("Error generating Excel export for event ID: {}", eventId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

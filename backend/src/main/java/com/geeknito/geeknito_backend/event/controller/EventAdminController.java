package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.EventRequestDTO;
import com.geeknito.geeknito_backend.event.dto.EventResponseDTO;
import com.geeknito.geeknito_backend.event.dto.EventUpdateDTO;
import com.geeknito.geeknito_backend.event.service.EventService;
import com.geeknito.geeknito_backend.exception.AccessDeniedException;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/admin/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Administration", description = "Event administration APIs for Admins and Teachers")
public class EventAdminController {

    private final EventService eventService;

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

    @PostMapping
    @Operation(summary = "Create an event", description = "Create a new event. Open to ADMIN and TEACHER roles.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or validation error"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<EventResponseDTO> createEvent(@Valid @RequestBody EventRequestDTO requestDTO) {
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Create event requested by user ID: {}", user.getId());
        EventResponseDTO created = eventService.createEvent(requestDTO, user.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event", description = "Update an existing event. Open to ADMIN and TEACHER roles (Teachers restricted to their own events).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or capacity constraint violation"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventResponseDTO> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventUpdateDTO updateDTO) {
        
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Update event ID {} requested by user ID: {}", id, user.getId());
        
        EventResponseDTO existingEvent = eventService.getEventById(id);
        
        // RBAC: Teachers may only update their own events
        if (user.getRole().equalsIgnoreCase("teacher") && !existingEvent.getCreatedById().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to modify this event.");
        }

        // Validate capacity constraints
        if (updateDTO.getCapacity() < existingEvent.getRegisteredCount()) {
            throw new IllegalArgumentException("Capacity cannot be decreased below the number of registered attendees (" + existingEvent.getRegisteredCount() + ")");
        }

        EventResponseDTO updated = eventService.updateEvent(id, updateDTO, user.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event", description = "Perform soft delete (sets status to CANCELLED) or hard delete (deletes record completely).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Successfully deleted event"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            @RequestParam(value = "hard", defaultValue = "false") boolean hard) {
        
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Delete event ID {} requested by user ID: {} (hard={})", id, user.getId(), hard);
        
        EventResponseDTO event = eventService.getEventById(id);
        
        // RBAC: Teacher can only delete their own events
        if (user.getRole().equalsIgnoreCase("teacher") && !event.getCreatedById().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this event.");
        }

        if (hard) {
            eventService.deleteEvent(id);
        } else {
            // Soft delete: update status to CANCELLED
            EventUpdateDTO updateDTO = EventUpdateDTO.builder()
                    .title(event.getTitle())
                    .description(event.getDescription())
                    .bannerUrl(event.getBannerUrl())
                    .bannerFileName(event.getBannerFileName())
                    .locationMode(event.getLocationMode())
                    .venue(event.getVenue())
                    .meetingLink(event.getMeetingLink())
                    .meetingProvider(event.getMeetingProvider())
                    .startDate(event.getStartDate())
                    .endDate(event.getEndDate())
                    .registrationDeadline(event.getRegistrationDeadline())
                    .capacity(event.getCapacity())
                    .organizerName(event.getOrganizerName())
                    .organizerEmail(event.getOrganizerEmail())
                    .status(EventStatus.CANCELLED)
                    .build();
            eventService.updateEvent(id, updateDTO, user.getId());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get admin event list", description = "Retrieve a paginated, filtered, and sorted list of events for administration.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved events page")
    })
    public ResponseEntity<Page<EventResponseDTO>> getAdminEvents(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) EventStatus status,
            @RequestParam(value = "mode", required = false) EventMode mode,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "startDate") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {

        UserEntity user = getAuthenticatedUser();
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Long creatorIdFilter = null;
        if (user.getRole().equalsIgnoreCase("teacher")) {
            // Teachers are strictly restricted to their own events
            creatorIdFilter = user.getId();
        }

        Page<EventResponseDTO> eventsPage = eventService.searchAndFilterEvents(search, status, mode, startDate, endDate, creatorIdFilter, pageable);
        return ResponseEntity.ok(eventsPage);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single event by ID", description = "Retrieve administrative details of a specific event.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved event"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        UserEntity user = getAuthenticatedUser();
        EventResponseDTO event = eventService.getEventById(id);

        // RBAC: Teachers are restricted to their own events
        if (user.getRole().equalsIgnoreCase("teacher") && !event.getCreatedById().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to view this event.");
        }

        return ResponseEntity.ok(event);
    }
}

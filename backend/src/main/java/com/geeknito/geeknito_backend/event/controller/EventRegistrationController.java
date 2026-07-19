package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.EventRegistrationDTO;
import com.geeknito.geeknito_backend.event.service.RegistrationService;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Registration", description = "Student-facing event registration APIs")
public class EventRegistrationController {

    private final RegistrationService registrationService;

    private UserEntity getAuthenticatedStudent() {
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

    @PostMapping("/{slug}/register")
    @Operation(summary = "Register for an event", description = "Register the currently authenticated student for the specified event by slug.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Successfully registered for the event"),
        @ApiResponse(responseCode = "400", description = "Invalid request or event has reached capacity/deadline has passed"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "409", description = "Already registered")
    })
    public ResponseEntity<EventRegistrationDTO> register(@PathVariable String slug) {
        UserEntity student = getAuthenticatedStudent();
        log.info("REST: Register student ID {} for event slug: {}", student.getId(), slug);
        try {
            EventRegistrationDTO registration = registrationService.registerStudent(slug, student.getId());
            return new ResponseEntity<>(registration, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            // Map IllegalStateException to IllegalArgumentException for 400 Bad Request
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @DeleteMapping("/{slug}/register")
    @Operation(summary = "Cancel registration for an event", description = "Cancel the registration of the currently authenticated student for the specified event by slug.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Successfully canceled registration"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "404", description = "Registration or event not found")
    })
    public ResponseEntity<Void> cancel(@PathVariable String slug) {
        UserEntity student = getAuthenticatedStudent();
        log.info("REST: Cancel registration for student ID {} and event slug: {}", student.getId(), slug);
        try {
            registrationService.cancelRegistration(slug, student.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    @GetMapping("/my-registrations")
    @Operation(summary = "Get student's own registrations", description = "Retrieve a list of all event registrations for the currently authenticated student.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved registrations"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<EventRegistrationDTO>> getMyRegistrations() {
        UserEntity student = getAuthenticatedStudent();
        log.info("REST: Fetching registrations for student ID: {}", student.getId());
        List<EventRegistrationDTO> registrations = registrationService.getRegistrationsForStudent(student.getId());
        return ResponseEntity.ok(registrations);
    }
}

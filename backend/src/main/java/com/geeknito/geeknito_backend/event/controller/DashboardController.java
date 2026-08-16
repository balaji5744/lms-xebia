package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.DashboardStatsDTO;
import com.geeknito.geeknito_backend.event.service.DashboardService;
import com.geeknito.geeknito_backend.exception.AuthenticationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/events/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Dashboard", description = "Administration dashboard statistics for events")
public class DashboardController {

    private final DashboardService dashboardService;

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

    @GetMapping
    @Operation(summary = "Get dashboard statistics", description = "Retrieve metrics for events, registrations, attendance, and certificates. Admins see global metrics, while Teachers only see metrics for events they created.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        UserEntity user = getAuthenticatedUser();
        log.info("REST: Fetching dashboard stats for user ID {}", user.getId());

        Long creatorId = null;
        if (user.getRole().equalsIgnoreCase("teacher")) {
            creatorId = user.getId();
        }

        DashboardStatsDTO stats = dashboardService.getDashboardStats(creatorId);
        return ResponseEntity.ok(stats);
    }
}

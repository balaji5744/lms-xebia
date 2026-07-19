package com.geeknito.geeknito_backend.event.controller;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.event.dto.EventResponseDTO;
import com.geeknito.geeknito_backend.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/catalog/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Event Catalog", description = "Public event catalog APIs")
public class EventPublicController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "Get list of events with filters, search, and pagination", description = "Retrieve a paginated, sorted list of events based on status, mode, search query, and date range.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved events page"),
        @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    public ResponseEntity<Page<EventResponseDTO>> getEvents(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) EventStatus status,
            @RequestParam(value = "mode", required = false) EventMode mode,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "startDate") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<EventResponseDTO> eventsPage = eventService.searchAndFilterEvents(search, status, mode, startDate, endDate, null, pageable);
        return ResponseEntity.ok(eventsPage);
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get event by slug", description = "Retrieve complete details of a specific event using its unique slug.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved event details"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventResponseDTO> getEventBySlug(@PathVariable String slug) {
        EventResponseDTO event = eventService.getEventBySlug(slug);
        return ResponseEntity.ok(event);
    }
}

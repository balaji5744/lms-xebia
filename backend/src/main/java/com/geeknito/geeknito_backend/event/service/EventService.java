package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.event.dto.EventRequestDTO;
import com.geeknito.geeknito_backend.event.dto.EventResponseDTO;
import com.geeknito.geeknito_backend.event.dto.EventSummaryDTO;
import com.geeknito.geeknito_backend.event.dto.EventUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    EventResponseDTO createEvent(EventRequestDTO dto, Long userId);
    EventResponseDTO updateEvent(Long id, EventUpdateDTO dto, Long userId);
    EventResponseDTO getEventById(Long id);
    EventResponseDTO getEventBySlug(String slug);
    void deleteEvent(Long id);
    Page<EventResponseDTO> searchAndFilterEvents(
        String search, EventStatus status, EventMode mode,
        LocalDateTime startDate, LocalDateTime endDate, Long creatorId, Pageable pageable
    );
    List<EventSummaryDTO> getUpcomingEvents();
    List<EventSummaryDTO> getCompletedEvents();
}

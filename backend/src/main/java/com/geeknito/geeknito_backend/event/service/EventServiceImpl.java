package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.entity.learning.EventMode;
import com.geeknito.geeknito_backend.entity.learning.EventStatus;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.EventRequestDTO;
import com.geeknito.geeknito_backend.event.dto.EventResponseDTO;
import com.geeknito.geeknito_backend.event.dto.EventSummaryDTO;
import com.geeknito.geeknito_backend.event.dto.EventUpdateDTO;
import com.geeknito.geeknito_backend.event.mapper.EventMapper;
import com.geeknito.geeknito_backend.event.repository.EventRepository;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import com.geeknito.geeknito_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public EventResponseDTO createEvent(EventRequestDTO dto, Long userId) {
        log.info("Creating event with title: {}", dto.getTitle());
        validateEvent(dto);

        UserEntity creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        String uniqueSlug = generateUniqueSlug(dto.getTitle());

        EventEntity event = EventEntity.builder()
                .title(dto.getTitle().trim())
                .slug(uniqueSlug)
                .description(dto.getDescription())
                .bannerUrl(dto.getBannerUrl())
                .bannerFileName(dto.getBannerFileName())
                .locationMode(dto.getLocationMode())
                .venue(dto.getVenue())
                .meetingLink(dto.getMeetingLink())
                .meetingProvider(dto.getMeetingProvider())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .registrationDeadline(dto.getRegistrationDeadline())
                .capacity(dto.getCapacity())
                .registeredCount(0)
                .organizerName(dto.getOrganizerName())
                .organizerEmail(dto.getOrganizerEmail())
                .status(dto.getStatus())
                .createdBy(creator)
                .build();

        EventEntity saved = eventRepository.save(event);
        log.info("Event created successfully with slug: {}", saved.getSlug());
        return EventMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public EventResponseDTO updateEvent(Long id, EventUpdateDTO dto, Long userId) {
        log.info("Updating event with ID: {}", id);
        validateEventUpdate(dto);

        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        // Generate dynamic unique slug only if title changes
        if (!event.getTitle().trim().equalsIgnoreCase(dto.getTitle().trim())) {
            String uniqueSlug = generateUniqueSlug(dto.getTitle());
            event.setSlug(uniqueSlug);
        }

        event.setTitle(dto.getTitle().trim());
        event.setDescription(dto.getDescription());
        event.setBannerUrl(dto.getBannerUrl());
        event.setBannerFileName(dto.getBannerFileName());
        event.setLocationMode(dto.getLocationMode());
        event.setVenue(dto.getVenue());
        event.setMeetingLink(dto.getMeetingLink());
        event.setMeetingProvider(dto.getMeetingProvider());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setRegistrationDeadline(dto.getRegistrationDeadline());
        event.setCapacity(dto.getCapacity());
        event.setOrganizerName(dto.getOrganizerName());
        event.setOrganizerEmail(dto.getOrganizerEmail());
        event.setStatus(dto.getStatus());

        EventEntity updated = eventRepository.save(event);
        log.info("Event updated successfully with slug: {}", updated.getSlug());
        return EventMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponseDTO getEventById(Long id) {
        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return EventMapper.toResponseDTO(event);
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponseDTO getEventBySlug(String slug) {
        EventEntity event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with slug: " + slug));
        return EventMapper.toResponseDTO(event);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        log.info("Deleting event with ID: {}", id);
        EventEntity event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventResponseDTO> searchAndFilterEvents(
            String search, EventStatus status, EventMode mode,
            LocalDateTime startDate, LocalDateTime endDate, Long creatorId, Pageable pageable) {
        log.info("Searching events. search={}, status={}, mode={}, creatorId={}", search, status, mode, creatorId);
        
        Specification<EventEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleLike, descLike));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (mode != null) {
                predicates.add(cb.equal(root.get("locationMode"), mode));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), endDate));
            }

            if (creatorId != null) {
                predicates.add(cb.equal(root.get("createdBy").get("id"), creatorId));
            }

            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };

        return eventRepository.findAll(spec, pageable)
                .map(EventMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventSummaryDTO> getUpcomingEvents() {
        log.info("Retrieving upcoming events");
        return eventRepository.findUpcomingEvents(LocalDateTime.now(), null).stream()
                .map(EventMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventSummaryDTO> getCompletedEvents() {
        log.info("Retrieving completed events");
        return eventRepository.findCompletedEvents(LocalDateTime.now(), null).stream()
                .map(EventMapper::toSummaryDTO)
                .collect(Collectors.toList());
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = title.trim().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (baseSlug.isEmpty()) {
            baseSlug = "event";
        }
        String slug = baseSlug;
        int count = 1;
        while (eventRepository.findBySlug(slug).isPresent()) {
            count++;
            slug = baseSlug + "-" + count;
        }
        return slug;
    }

    private void validateEvent(EventRequestDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be blank");
        }
        if (dto.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than 0");
        }
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        if (dto.getRegistrationDeadline() == null) {
            throw new IllegalArgumentException("Registration deadline is required");
        }
        if (dto.getRegistrationDeadline().isAfter(dto.getStartDate())) {
            throw new IllegalArgumentException("Registration deadline cannot be after event start date");
        }
        if (dto.getLocationMode() == null) {
            throw new IllegalArgumentException("Location mode is required");
        }
        if (dto.getLocationMode() == EventMode.ONLINE || dto.getLocationMode() == EventMode.HYBRID) {
            if (dto.getMeetingLink() == null || dto.getMeetingLink().trim().isEmpty()) {
                throw new IllegalArgumentException("Meeting link is required for ONLINE/HYBRID events");
            }
        }
        if (dto.getLocationMode() == EventMode.OFFLINE || dto.getLocationMode() == EventMode.HYBRID) {
            if (dto.getVenue() == null || dto.getVenue().trim().isEmpty()) {
                throw new IllegalArgumentException("Venue is required for OFFLINE/HYBRID events");
            }
        }
        if (dto.getOrganizerEmail() == null || !dto.getOrganizerEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid organizer email");
        }
    }

    private void validateEventUpdate(EventUpdateDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be blank");
        }
        if (dto.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than 0");
        }
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        if (dto.getRegistrationDeadline() == null) {
            throw new IllegalArgumentException("Registration deadline is required");
        }
        if (dto.getRegistrationDeadline().isAfter(dto.getStartDate())) {
            throw new IllegalArgumentException("Registration deadline cannot be after event start date");
        }
        if (dto.getLocationMode() == null) {
            throw new IllegalArgumentException("Location mode is required");
        }
        if (dto.getLocationMode() == EventMode.ONLINE || dto.getLocationMode() == EventMode.HYBRID) {
            if (dto.getMeetingLink() == null || dto.getMeetingLink().trim().isEmpty()) {
                throw new IllegalArgumentException("Meeting link is required for ONLINE/HYBRID events");
            }
        }
        if (dto.getLocationMode() == EventMode.OFFLINE || dto.getLocationMode() == EventMode.HYBRID) {
            if (dto.getVenue() == null || dto.getVenue().trim().isEmpty()) {
                throw new IllegalArgumentException("Venue is required for OFFLINE/HYBRID events");
            }
        }
        if (dto.getOrganizerEmail() == null || !dto.getOrganizerEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid organizer email");
        }
    }
}

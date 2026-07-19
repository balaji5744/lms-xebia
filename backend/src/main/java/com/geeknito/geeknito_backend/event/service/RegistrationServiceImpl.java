package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.entity.learning.EventRegistrationEntity;
import com.geeknito.geeknito_backend.entity.learning.UserEntity;
import com.geeknito.geeknito_backend.event.dto.AttendanceUpdateDTO;
import com.geeknito.geeknito_backend.event.dto.EventRegistrationDTO;
import com.geeknito.geeknito_backend.event.mapper.EventMapper;
import com.geeknito.geeknito_backend.event.repository.EventRegistrationRepository;
import com.geeknito.geeknito_backend.event.repository.EventRepository;
import com.geeknito.geeknito_backend.exception.ResourceNotFoundException;
import com.geeknito.geeknito_backend.user.repository.UserRepository;
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
public class RegistrationServiceImpl implements RegistrationService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public EventRegistrationDTO registerStudent(String eventSlug, Long studentId) {
        log.info("Registering student ID: {} for event slug: {}", studentId, eventSlug);

        EventEntity event = eventRepository.findBySlug(eventSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with slug: " + eventSlug));

        UserEntity student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        if (eventRegistrationRepository.existsByEventIdAndStudentId(event.getId(), studentId)) {
            throw new IllegalStateException("Student is already registered for this event");
        }

        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new IllegalStateException("Registration deadline has passed");
        }

        if (event.getRegisteredCount() >= event.getCapacity()) {
            throw new IllegalStateException("Event has reached its capacity limit");
        }

        // Increment registered count transactionally
        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        EventRegistrationEntity registration = EventRegistrationEntity.builder()
                .event(event)
                .student(student)
                .attendanceStatus(AttendanceStatus.REGISTERED)
                .certificateIssued(false)
                .remarks("")
                .build();

        EventRegistrationEntity saved = eventRegistrationRepository.save(registration);
        log.info("Student ID: {} successfully registered for event ID: {}", studentId, event.getId());
        return EventMapper.toRegistrationDTO(saved);
    }

    @Override
    @Transactional
    public void cancelRegistration(String eventSlug, Long studentId) {
        log.info("Canceling registration for student ID: {} and event slug: {}", studentId, eventSlug);

        EventEntity event = eventRepository.findBySlug(eventSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with slug: " + eventSlug));

        EventRegistrationEntity registration = eventRegistrationRepository.findByEventIdAndStudentId(event.getId(), studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for student ID: " + studentId + " in event ID: " + event.getId()));

        eventRegistrationRepository.delete(registration);

        // Decrement registered count transactionally
        if (event.getRegisteredCount() > 0) {
            event.setRegisteredCount(event.getRegisteredCount() - 1);
            eventRepository.save(event);
        }
        log.info("Registration successfully canceled for student ID: {} and event ID: {}", studentId, event.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getRegistrationsForEvent(Long eventId) {
        log.info("Fetching registrations for event ID: {}", eventId);
        return eventRegistrationRepository.findByEventId(eventId).stream()
                .map(EventMapper::toRegistrationDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationDTO> getRegistrationsForStudent(Long studentId) {
        log.info("Fetching registrations for student ID: {}", studentId);
        return eventRegistrationRepository.findByStudentId(studentId).stream()
                .map(EventMapper::toRegistrationDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventRegistrationDTO updateAttendance(Long registrationId, AttendanceUpdateDTO dto) {
        log.info("Updating attendance for registration ID: {} to status: {}", registrationId, dto.getAttendanceStatus());

        EventRegistrationEntity registration = eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        AttendanceStatus newStatus = dto.getAttendanceStatus();
        if (newStatus != AttendanceStatus.CHECKED_IN && newStatus != AttendanceStatus.ATTENDED && newStatus != AttendanceStatus.ABSENT && newStatus != AttendanceStatus.REGISTERED) {
            throw new IllegalArgumentException("Invalid attendance status");
        }

        registration.setAttendanceStatus(newStatus);
        if (dto.getRemarks() != null) {
            registration.setRemarks(dto.getRemarks());
        }

        EventRegistrationEntity saved = eventRegistrationRepository.save(registration);
        log.info("Attendance updated successfully for registration ID: {}", registrationId);
        return EventMapper.toRegistrationDTO(saved);
    }
}

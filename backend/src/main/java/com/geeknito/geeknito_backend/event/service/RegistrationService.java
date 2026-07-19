package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.event.dto.AttendanceUpdateDTO;
import com.geeknito.geeknito_backend.event.dto.EventRegistrationDTO;

import java.util.List;

public interface RegistrationService {
    EventRegistrationDTO registerStudent(String eventSlug, Long studentId);
    void cancelRegistration(String eventSlug, Long studentId);
    List<EventRegistrationDTO> getRegistrationsForEvent(Long eventId);
    List<EventRegistrationDTO> getRegistrationsForStudent(Long studentId);
    EventRegistrationDTO updateAttendance(Long registrationId, AttendanceUpdateDTO dto);
}

package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.event.dto.ExportRegistrationDTO;
import com.geeknito.geeknito_backend.event.dto.ExportRowDTO;

import java.util.List;

public interface EventExportService {
    List<ExportRegistrationDTO> getExportRegistrations(Long eventId);
    List<ExportRowDTO> getExportRows(Long eventId);
}

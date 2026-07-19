package com.geeknito.geeknito_backend.event.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportRowDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String studentName;
    private String studentEmail;
    private LocalDateTime registeredAt;
    private String attendanceStatus;
    private boolean certificateIssued;
    private String remarks;
}

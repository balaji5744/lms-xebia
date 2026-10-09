package com.geeknito.geeknito_backend.event.dto;

import com.geeknito.geeknito_backend.entity.learning.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceUpdateDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus attendanceStatus;

    private String remarks;
}

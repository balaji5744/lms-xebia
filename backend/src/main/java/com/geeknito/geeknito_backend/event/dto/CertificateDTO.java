package com.geeknito.geeknito_backend.event.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long registrationId;
    private String eventTitle;
    private String studentName;
    private String studentEmail;
    private LocalDateTime issuedAt;
}

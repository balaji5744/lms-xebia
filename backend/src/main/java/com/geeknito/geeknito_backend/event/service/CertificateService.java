package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.event.dto.CertificateDTO;

import java.util.List;

public interface CertificateService {
    CertificateDTO issueCertificate(Long registrationId);
    List<CertificateDTO> getCertificatesForStudent(Long studentId);
}

package com.geeknito.geeknito_backend.coding.service;

import com.geeknito.geeknito_backend.coding.dto.*;
import java.util.List;

public interface StudentCodingService {

    CodingProblemResponseDTO getProblem(Long problemId);

    RunResponseDTO runCode(Long problemId, RunRequestDTO request);

    SubmissionResponseDTO submitSolution(Long problemId, SubmissionRequestDTO request);

    List<SubmissionResponseDTO> getSubmissions(Long problemId, String studentId);

    SubmissionResponseDTO getSubmissionDetails(Long submissionId);
}

package com.geeknito.geeknito_backend.coding.controller;

import com.geeknito.geeknito_backend.coding.dto.*;
import com.geeknito.geeknito_backend.coding.service.StudentCodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coding-problems")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentCodingController {

    private final StudentCodingService studentCodingService;

    @GetMapping("/{problemId}")
    public ResponseEntity<CodingProblemResponseDTO> getProblem(@PathVariable Long problemId) {
        CodingProblemResponseDTO problem = studentCodingService.getProblem(problemId);
        return ResponseEntity.ok(problem);
    }

    @PostMapping("/{problemId}/run")
    public ResponseEntity<RunResponseDTO> runCode(
            @PathVariable Long problemId,
            @RequestBody RunRequestDTO request) {
        RunResponseDTO result = studentCodingService.runCode(problemId, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{problemId}/submit")
    public ResponseEntity<SubmissionResponseDTO> submitSolution(
            @PathVariable Long problemId,
            @RequestBody SubmissionRequestDTO request) {
        SubmissionResponseDTO result = studentCodingService.submitSolution(problemId, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{problemId}/submissions")
    public ResponseEntity<List<SubmissionResponseDTO>> getSubmissions(
            @PathVariable Long problemId,
            @RequestParam String studentId) {
        List<SubmissionResponseDTO> history = studentCodingService.getSubmissions(problemId, studentId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<SubmissionResponseDTO> getSubmissionDetails(@PathVariable Long submissionId) {
        SubmissionResponseDTO details = studentCodingService.getSubmissionDetails(submissionId);
        return ResponseEntity.ok(details);
    }
}

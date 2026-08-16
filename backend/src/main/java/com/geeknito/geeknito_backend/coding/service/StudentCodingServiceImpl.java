package com.geeknito.geeknito_backend.coding.service;

import com.geeknito.geeknito_backend.coding.dto.*;
import com.geeknito.geeknito_backend.coding.execution.SandboxExecutionClient;
import com.geeknito.geeknito_backend.coding.judge.OutputComparator;
import com.geeknito.geeknito_backend.coding.repository.*;
import com.geeknito.geeknito_backend.entity.learning.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentCodingServiceImpl implements StudentCodingService {

    private final CodingProblemRepository codingProblemRepository;
    private final TestCaseRepository testCaseRepository;
    private final StarterCodeRepository starterCodeRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionResultRepository submissionResultRepository;
    private final SandboxExecutionClient executionClient;
    private final OutputComparator outputComparator;

    @Override
    @Transactional(readOnly = true)
    public CodingProblemResponseDTO getProblem(Long problemId) {
        CodingProblemEntity problem = codingProblemRepository.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("Coding problem not found with ID: " + problemId));
        return mapProblemForStudent(problem);
    }

    @Override
    @Transactional
    public RunResponseDTO runCode(Long problemId, RunRequestDTO request) {
        CodingProblemEntity problem = codingProblemRepository.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("Coding problem not found with ID: " + problemId));

        // Fetch only public test cases
        List<TestCaseEntity> publicTcs = testCaseRepository.findByProblemIdAndIsHiddenOrderByTestOrderAsc(problemId, false);

        if (publicTcs.isEmpty()) {
            return RunResponseDTO.builder()
                    .status("SYSTEM_ERROR")
                    .compileError("No public test cases configured for this problem.")
                    .build();
        }

        // Map to sandbox request
        List<SandboxExecutionClient.ExecutionRequest.TestCaseDTO> execTcs = publicTcs.stream()
                .map(tc -> SandboxExecutionClient.ExecutionRequest.TestCaseDTO.builder()
                        .id(tc.getId())
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .timeout(problem.getTimeLimit())
                        .build())
                .collect(Collectors.toList());

        SandboxExecutionClient.ExecutionRequest execRequest = SandboxExecutionClient.ExecutionRequest.builder()
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .testCases(execTcs)
                .build();

        // Invoke sandbox
        SandboxExecutionClient.ExecutionResponse execResponse = executionClient.execute(execRequest);

        if ("COMPILATION_ERROR".equals(execResponse.getStatus())) {
            return RunResponseDTO.builder()
                    .status("COMPILATION_ERROR")
                    .compileError(execResponse.getCompileError())
                    .build();
        }

        if ("SYSTEM_ERROR".equals(execResponse.getStatus())) {
            return RunResponseDTO.builder()
                    .status("SYSTEM_ERROR")
                    .compileError(execResponse.getCompileError())
                    .build();
        }

        // Map results back
        Map<Long, SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO> resultsMap = execResponse.getResults().stream()
                .collect(Collectors.toMap(
                        SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO::getId,
                        r -> r,
                        (existing, replacement) -> existing
                ));

        List<RunResponseDTO.TestCaseRunResultDTO> runResults = new ArrayList<>();
        for (TestCaseEntity tc : publicTcs) {
            SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO res = resultsMap.get(tc.getId());
            if (res != null) {
                // Perform final output comparison using our OutputComparator
                String actualOutput = res.getActualOutput();
                String expectedOutput = tc.getExpectedOutput();
                boolean matches = outputComparator.compare(actualOutput, expectedOutput);
                String status = matches ? "Accepted" : ("Accepted".equals(res.getStatus()) ? "Wrong Answer" : res.getStatus());

                runResults.add(RunResponseDTO.TestCaseRunResultDTO.builder()
                        .testCaseId(tc.getId())
                        .status(status)
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .actualOutput(actualOutput)
                        .executionTime(res.getExecutionTime())
                        .memoryUsed(res.getMemoryUsed())
                        .build());
            } else {
                runResults.add(RunResponseDTO.TestCaseRunResultDTO.builder()
                        .testCaseId(tc.getId())
                        .status("System Error")
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .actualOutput("Sandbox did not return result for this case.")
                        .executionTime(0)
                        .memoryUsed(0.0)
                        .build());
            }
        }

        return RunResponseDTO.builder()
                .status("SUCCESS")
                .testCaseResults(runResults)
                .build();
    }

    @Override
    @Transactional
    public SubmissionResponseDTO submitSolution(Long problemId, SubmissionRequestDTO request) {
        CodingProblemEntity problem = codingProblemRepository.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("Coding problem not found with ID: " + problemId));

        // Fetch ALL test cases
        List<TestCaseEntity> allTcs = testCaseRepository.findByProblemIdOrderByTestOrderAsc(problemId);

        if (allTcs.isEmpty()) {
            throw new IllegalStateException("Cannot submit: No test cases are configured for this problem.");
        }

        // Map to sandbox request
        List<SandboxExecutionClient.ExecutionRequest.TestCaseDTO> execTcs = allTcs.stream()
                .map(tc -> SandboxExecutionClient.ExecutionRequest.TestCaseDTO.builder()
                        .id(tc.getId())
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .timeout(problem.getTimeLimit())
                        .build())
                .collect(Collectors.toList());

        SandboxExecutionClient.ExecutionRequest execRequest = SandboxExecutionClient.ExecutionRequest.builder()
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .testCases(execTcs)
                .build();

        // Invoke sandbox
        SandboxExecutionClient.ExecutionResponse execResponse = executionClient.execute(execRequest);

        CodingSubmissionEntity.CodingSubmissionEntityBuilder subBuilder = CodingSubmissionEntity.builder()
                .problem(problem)
                .studentId(request.getStudentId())
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode());

        List<SubmissionResultEntity> resultEntities = new ArrayList<>();
        
        if ("COMPILATION_ERROR".equals(execResponse.getStatus())) {
            subBuilder.status("Compilation Error")
                    .score(0)
                    .passedTests(0)
                    .totalTests(allTcs.size())
                    .errorMessage(execResponse.getCompileError())
                    .executionTime(0)
                    .memoryUsed(0.0);

            CodingSubmissionEntity saved = submissionRepository.save(subBuilder.build());
            return mapSubmissionToResponse(saved);
        }

        if ("SYSTEM_ERROR".equals(execResponse.getStatus())) {
            subBuilder.status("System Error")
                    .score(0)
                    .passedTests(0)
                    .totalTests(allTcs.size())
                    .errorMessage(execResponse.getCompileError())
                    .executionTime(0)
                    .memoryUsed(0.0);

            CodingSubmissionEntity saved = submissionRepository.save(subBuilder.build());
            return mapSubmissionToResponse(saved);
        }

        // Evaluate all runs
        Map<Long, SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO> resultsMap = execResponse.getResults().stream()
                .collect(Collectors.toMap(
                        SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO::getId,
                        r -> r,
                        (existing, replacement) -> existing
                ));

        int passedCount = 0;
        int accumulatedScore = 0;
        int maxTime = 0;
        double maxMemory = 0.0;
        boolean hasWrongAnswer = false;
        boolean hasTle = false;
        boolean hasRe = false;

        for (TestCaseEntity tc : allTcs) {
            SandboxExecutionClient.ExecutionResponse.TestCaseResultDTO res = resultsMap.get(tc.getId());
            
            String status = "Wrong Answer";
            String actualOutput = "";
            int time = 0;
            double mem = 0.0;

            if (res != null) {
                actualOutput = res.getActualOutput();
                time = res.getExecutionTime();
                mem = res.getMemoryUsed();
                
                maxTime = Math.max(maxTime, time);
                maxMemory = Math.max(maxMemory, mem);

                boolean matches = outputComparator.compare(actualOutput, tc.getExpectedOutput());
                if (matches) {
                    status = "Accepted";
                    passedCount++;
                    accumulatedScore += tc.getPoints();
                } else {
                    if ("Accepted".equals(res.getStatus())) {
                        status = "Wrong Answer";
                        hasWrongAnswer = true;
                    } else {
                        status = res.getStatus();
                        if ("Time Limit Exceeded".equals(status)) hasTle = true;
                        if ("Runtime Error".equals(status)) hasRe = true;
                    }
                }
            } else {
                hasWrongAnswer = true;
            }

            resultEntities.add(SubmissionResultEntity.builder()
                    .testCase(tc)
                    .status(status)
                    .actualOutput(actualOutput)
                    .executionTime(time)
                    .memoryUsed(mem)
                    .build());
        }

        // Determine final submission status
        String finalStatus = "Accepted";
        if (passedCount < allTcs.size()) {
            if (hasTle) finalStatus = "Time Limit Exceeded";
            else if (hasRe) finalStatus = "Runtime Error";
            else finalStatus = "Wrong Answer";
        }

        subBuilder.status(finalStatus)
                .score(accumulatedScore)
                .passedTests(passedCount)
                .totalTests(allTcs.size())
                .executionTime(maxTime)
                .memoryUsed(maxMemory);

        CodingSubmissionEntity submission = subBuilder.build();
        CodingSubmissionEntity savedSubmission = submissionRepository.save(submission);

        // Save individual case results
        for (SubmissionResultEntity resEnt : resultEntities) {
            resEnt.setSubmission(savedSubmission);
        }
        submissionResultRepository.saveAll(resultEntities);
        savedSubmission.setResults(resultEntities);

        return mapSubmissionToResponse(savedSubmission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponseDTO> getSubmissions(Long problemId, String studentId) {
        List<CodingSubmissionEntity> subs = submissionRepository.findByProblemIdAndStudentIdOrderBySubmittedAtDesc(problemId, studentId);
        return subs.stream().map(this::mapSubmissionToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResponseDTO getSubmissionDetails(Long submissionId) {
        CodingSubmissionEntity sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found with ID: " + submissionId));
        return mapSubmissionToResponse(sub);
    }

    // --- Helper Mappers ---

    private CodingProblemResponseDTO mapProblemForStudent(CodingProblemEntity problem) {
        // Exclude hidden test cases and template data inside student view
        List<TestCaseResponseDTO> publicCases = problem.getTestCases().stream()
                .filter(tc -> !tc.isHidden())
                .map(tc -> TestCaseResponseDTO.builder()
                        .id(tc.getId())
                        .input(tc.getInput())
                        .expectedOutput(tc.getExpectedOutput())
                        .isHidden(false)
                        .points(tc.getPoints())
                        .testOrder(tc.getTestOrder())
                        .build())
                .collect(Collectors.toList());

        List<StarterCodeResponseDTO> templates = problem.getStarterCodes().stream()
                .map(sc -> StarterCodeResponseDTO.builder()
                        .id(sc.getId())
                        .language(sc.getLanguage())
                        .code(sc.getCode())
                        .build())
                .collect(Collectors.toList());

        return CodingProblemResponseDTO.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .description(problem.getDescription())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .constraints(problem.getConstraints())
                .explanation(problem.getExplanation())
                .difficulty(problem.getDifficulty())
                .points(problem.getPoints())
                .timeLimit(problem.getTimeLimit())
                .memoryLimit(problem.getMemoryLimit())
                .testCases(publicCases)
                .starterCodes(templates)
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .build();
    }

    private SubmissionResponseDTO mapSubmissionToResponse(CodingSubmissionEntity sub) {
        List<SubmissionResponseDTO.TestCaseSubmissionResultDTO> results = null;
        if (sub.getResults() != null) {
            results = sub.getResults().stream()
                    .map(res -> {
                        boolean hidden = res.getTestCase().isHidden();
                        return SubmissionResponseDTO.TestCaseSubmissionResultDTO.builder()
                                .testCaseId(res.getTestCase().getId())
                                .isHidden(hidden)
                                .status(res.getStatus())
                                .input(hidden ? null : res.getTestCase().getInput())
                                .expectedOutput(hidden ? null : res.getTestCase().getExpectedOutput())
                                .actualOutput(hidden ? null : res.getActualOutput())
                                .executionTime(res.getExecutionTime())
                                .memoryUsed(res.getMemoryUsed())
                                .build();
                    })
                    .collect(Collectors.toList());
        }

        return SubmissionResponseDTO.builder()
                .id(sub.getId())
                .problemId(sub.getProblem().getId())
                .studentId(sub.getStudentId())
                .language(sub.getLanguage())
                .sourceCode(sub.getSourceCode())
                .status(sub.getStatus())
                .score(sub.getScore())
                .passedTests(sub.getPassedTests())
                .totalTests(sub.getTotalTests())
                .executionTime(sub.getExecutionTime())
                .memoryUsed(sub.getMemoryUsed())
                .errorMessage(sub.getErrorMessage())
                .testCaseResults(results)
                .submittedAt(sub.getSubmittedAt())
                .build();
    }
}

package com.geeknito.geeknito_backend.coding.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long problemId;
    private String studentId;
    private String language;
    private String sourceCode;
    private String status;
    private Integer score;
    private Integer passedTests;
    private Integer totalTests;
    private Integer executionTime;
    private Double memoryUsed;
    private String errorMessage;
    private List<TestCaseSubmissionResultDTO> testCaseResults;
    private LocalDateTime submittedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TestCaseSubmissionResultDTO implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long testCaseId;
        private boolean isHidden;
        private String status;
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private Integer executionTime;
        private Double memoryUsed;
    }
}

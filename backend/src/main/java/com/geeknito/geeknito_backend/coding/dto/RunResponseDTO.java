package com.geeknito.geeknito_backend.coding.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunResponseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String status; // SUCCESS, COMPILATION_ERROR, SYSTEM_ERROR
    private String compileError;
    private List<TestCaseRunResultDTO> testCaseResults;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TestCaseRunResultDTO implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long testCaseId;
        private String status; // Passed, Wrong Answer, Time Limit Exceeded, Runtime Error
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private Integer executionTime;
        private Double memoryUsed;
    }
}

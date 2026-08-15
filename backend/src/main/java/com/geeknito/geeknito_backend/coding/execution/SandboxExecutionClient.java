package com.geeknito.geeknito_backend.coding.execution;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.Serializable;
import java.util.List;

@Component
public class SandboxExecutionClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${lms.execution-service.url:http://localhost:8081}")
    private String executionServiceUrl;

    public ExecutionResponse execute(ExecutionRequest request) {
        String url = executionServiceUrl + "/execute";
        try {
            return restTemplate.postForObject(url, request, ExecutionResponse.class);
        } catch (Exception e) {
            return ExecutionResponse.builder()
                    .status("SYSTEM_ERROR")
                    .compileError("Failed to reach Code Execution Service: " + e.getMessage())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExecutionRequest implements Serializable {
        private String language;
        private String sourceCode;
        private List<TestCaseDTO> testCases;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class TestCaseDTO implements Serializable {
            private Long id;
            private String input;
            private String expectedOutput;
            private Integer timeout; // in ms
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExecutionResponse implements Serializable {
        private String status; // SUCCESS, COMPILATION_ERROR, SYSTEM_ERROR
        private String compileError;
        private List<TestCaseResultDTO> results;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class TestCaseResultDTO implements Serializable {
            private Long id;
            private String status; // Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error
            private String actualOutput;
            private Integer exitCode;
            private Integer executionTime;
            private Double memoryUsed;
        }
    }
}

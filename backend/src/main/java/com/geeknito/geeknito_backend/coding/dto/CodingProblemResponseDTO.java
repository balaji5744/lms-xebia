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
public class CodingProblemResponseDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String slug;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String explanation;
    private String difficulty; // Easy, Medium, Hard
    private Integer points;
    private Integer timeLimit;
    private Integer memoryLimit;
    private List<TestCaseResponseDTO> testCases;
    private List<StarterCodeResponseDTO> starterCodes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

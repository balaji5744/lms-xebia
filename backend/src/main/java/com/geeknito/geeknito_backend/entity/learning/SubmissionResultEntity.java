package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "coding_submission_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"submission", "testCase"})
public class SubmissionResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private SubmissionEntity submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_case_id", nullable = false)
    private TestCaseEntity testCase;

    @Column(nullable = false)
    private String status;

    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    @Column(name = "execution_time")
    private Integer executionTime; // in ms

    @Column(name = "memory_used")
    private Double memoryUsed; // in MB
}

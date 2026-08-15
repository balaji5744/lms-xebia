package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "coding_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"problem", "results"})
public class SubmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private CodingProblemEntity problem;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String language;

    @Column(name = "source_code", columnDefinition = "TEXT", nullable = false)
    private String sourceCode;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "passed_tests", nullable = false)
    private Integer passedTests;

    @Column(name = "total_tests", nullable = false)
    private Integer totalTests;

    @Column(name = "execution_time")
    private Integer executionTime; // in ms

    @Column(name = "memory_used")
    private Double memoryUsed; // in MB

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmissionResultEntity> results;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
}

package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "coding_test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "problem")
public class TestCaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private CodingProblemEntity problem;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private boolean isHidden;

    @Column(nullable = false)
    private Integer points;

    @Column(name = "test_order", nullable = false)
    private Integer testOrder;
}

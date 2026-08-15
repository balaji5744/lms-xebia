package com.geeknito.geeknito_backend.entity.learning;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "coding_starter_code")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "problem")
public class StarterCodeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private CodingProblemEntity problem;

    @Column(nullable = false)
    private String language; // java, python, cpp, c

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;
}

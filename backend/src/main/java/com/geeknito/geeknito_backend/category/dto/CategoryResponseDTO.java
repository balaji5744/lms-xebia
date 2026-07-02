package com.geeknito.geeknito_backend.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDTO {

    private Long id;
    private String name;
    private String icon;
    private String description;
    private String color;
    
    @JsonProperty("isActive")
    private Boolean Active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private Long courseCount;
}

package com.campushub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Club.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubDto {
    private Long id;

    @NotBlank(message = "Club name is required")
    @Size(max = 150, message = "Club name must be at most 150 characters")
    private String name;

    private String description;

    @NotNull(message = "Creator user ID is required")
    private Long createdById;
}

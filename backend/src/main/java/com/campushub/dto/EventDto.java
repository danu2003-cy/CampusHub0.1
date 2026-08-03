package com.campushub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Event.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;

    @NotNull(message = "Club ID is required")
    private Long clubId;

    @NotBlank(message = "Event title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    private String description;
    private LocalDateTime eventDate;

    @Size(max = 200, message = "Location must be at most 200 characters")
    private String location;

    private Long createdById;
}

package com.campushub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Announcement.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDto {
    private Long id;

    @NotNull(message = "Club ID is required")
    private Long clubId;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    private String content;
    private Long postedById;
    private LocalDateTime postedAt;
}
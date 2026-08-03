package com.campushub.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Registration.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDto {
    private Long id;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String status; // PENDING, CONFIRMED, CANCELLED
    private LocalDateTime registeredAt;
    private String eventTitle;
}

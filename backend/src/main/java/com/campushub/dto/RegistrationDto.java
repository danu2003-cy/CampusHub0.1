package com.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
/**
 * Data Transfer Object for Registration.
 * TODO (Member 5): map fields to/from the Registration entity in the service layer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDto {
    private Long id;
    private Long eventId;
    private Long userId;
    private String status; // PENDING, CONFIRMED, CANCELLED
    private LocalDateTime registeredAt;
    private String eventTitle;
}

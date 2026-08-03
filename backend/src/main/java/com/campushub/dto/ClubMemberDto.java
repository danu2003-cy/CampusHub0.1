package com.campushub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for ClubMember.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubMemberDto {
    private Long id;
    private Long clubId;
    private Long userId;
    private String roleInClub;
    private LocalDateTime joinedAt;
}

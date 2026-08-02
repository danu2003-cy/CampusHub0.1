package com.campushub.dto;
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
    private Long clubId;
    private String title;
    private String content;
    private Long postedById;
    private LocalDateTime postedAt;
}
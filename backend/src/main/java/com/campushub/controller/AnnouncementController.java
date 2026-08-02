package com.campushub.controller;

import com.campushub.dto.AnnouncementDto;
import com.campushub.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Announcement management.
 */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<AnnouncementDto>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementById(id));
    }

    @PostMapping
    public ResponseEntity<AnnouncementDto> createAnnouncement(@RequestBody AnnouncementDto announcementDto) {
        return ResponseEntity.ok(announcementService.createAnnouncement(announcementDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(@PathVariable Long id, @RequestBody AnnouncementDto announcementDto) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, announcementDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}

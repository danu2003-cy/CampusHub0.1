package com.campushub.controller;

import com.campushub.dto.ClubDto;
import com.campushub.dto.EventDto;
import com.campushub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Event management.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 5, sort = "eventDate") Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEvents(search, pageable));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> getUpcomingEvents(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(limit));
    }

    @GetMapping("/club-options")
    public ResponseEntity<List<ClubDto>> getClubOptions() {
        return ResponseEntity.ok(eventService.getClubOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto) {
        return ResponseEntity.ok(eventService.createEvent(eventDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id, @RequestBody EventDto eventDto) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}

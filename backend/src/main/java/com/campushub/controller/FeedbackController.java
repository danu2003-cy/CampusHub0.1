package com.campushub.controller;

import com.campushub.dto.FeedbackDto;
import com.campushub.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Feedback management.
 
 */
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<List<FeedbackDto>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackDto> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> createFeedback(@RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(feedbackService.createFeedback(feedbackDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackDto> updateFeedback(@PathVariable Long id, @RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, feedbackDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}

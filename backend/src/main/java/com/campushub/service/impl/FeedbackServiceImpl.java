package com.campushub.service.impl;

import com.campushub.dto.FeedbackDto;
import com.campushub.entity.Event;
import com.campushub.entity.Feedback;
import com.campushub.entity.User;
import com.campushub.repository.EventRepository;
import com.campushub.repository.FeedbackRepository;
import com.campushub.repository.UserRepository;
import com.campushub.service.FeedbackService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<FeedbackDto> getAllFeedback() {

        return feedbackRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FeedbackDto getFeedbackById(Long id) {

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        return convertToDto(feedback);
    }

    @Override
    public FeedbackDto createFeedback(FeedbackDto feedbackDto) {

        Event event = eventRepository.findById(feedbackDto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(feedbackDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();

        feedback.setEvent(event);
        feedback.setUser(user);
        feedback.setRating(feedbackDto.getRating());
        feedback.setComments(feedbackDto.getComments());
        feedback.setSubmittedAt(LocalDateTime.now());

        Feedback savedFeedback = feedbackRepository.save(feedback);

        return convertToDto(savedFeedback);
    }

    @Override
    public FeedbackDto updateFeedback(Long id, FeedbackDto feedbackDto) {

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        Event event = eventRepository.findById(feedbackDto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(feedbackDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        feedback.setEvent(event);
        feedback.setUser(user);
        feedback.setRating(feedbackDto.getRating());
        feedback.setComments(feedbackDto.getComments());

        Feedback updatedFeedback = feedbackRepository.save(feedback);

        return convertToDto(updatedFeedback);
    }

    @Override
    public void deleteFeedback(Long id) {

        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback not found");
        }

        feedbackRepository.deleteById(id);
    }

    private FeedbackDto convertToDto(Feedback feedback) {

        FeedbackDto dto = new FeedbackDto();

        dto.setId(feedback.getId());
        dto.setEventId(feedback.getEvent().getId());
        dto.setUserId(feedback.getUser().getId());
        dto.setRating(feedback.getRating());
        dto.setComments(feedback.getComments());

        return dto;
    }
}
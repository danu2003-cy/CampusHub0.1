package com.campushub.service;

import com.campushub.dto.FeedbackDto;

import java.util.List;

/*Service contract for Feedback management.*/

public interface FeedbackService {

    List<FeedbackDto> getAllFeedback();

    FeedbackDto getFeedbackById(Long id);

    FeedbackDto createFeedback(FeedbackDto feedbackDto);

    FeedbackDto updateFeedback(Long id, FeedbackDto feedbackDto);

    void deleteFeedback(Long id);
}

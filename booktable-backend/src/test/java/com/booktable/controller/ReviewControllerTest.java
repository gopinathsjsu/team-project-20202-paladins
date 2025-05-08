package com.booktable.controller;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.model.User;
import com.booktable.service.ReviewService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private User mockUser;
    private CreateReviewRequest mockCreateRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setId("user123");

        mockCreateRequest = new CreateReviewRequest();
        mockCreateRequest.setRestaurantId(new ObjectId());
        mockCreateRequest.setRating(4);
        mockCreateRequest.setComment("Great experience!");
    }

    @Test
    void createReview_throwsExceptionWhenInvalidRating() {
        mockCreateRequest.setRating(6); // Invalid rating

        assertThrows(IllegalArgumentException.class, () ->
                reviewController.createReview(mockCreateRequest, mockUser)
        );
    }


}
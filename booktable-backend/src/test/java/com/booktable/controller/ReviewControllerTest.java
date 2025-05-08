package com.booktable.controller;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.dto.ReviewsByRestaurantRequest;
import com.booktable.model.Review;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
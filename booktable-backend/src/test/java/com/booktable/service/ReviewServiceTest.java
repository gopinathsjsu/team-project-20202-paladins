package com.booktable.service;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.model.Review;
import com.booktable.repository.ReviewRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RestaurantService restaurantService;

    @InjectMocks
    private ReviewService reviewService;

    private ObjectId reviewId;
    private ObjectId customerId;
    private ObjectId restaurantId;
    private Review mockReview;
    private CreateReviewRequest mockRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        reviewId = new ObjectId();
        customerId = new ObjectId();
        restaurantId = new ObjectId();

        mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setCustomerId(customerId);
        mockReview.setRestaurantId(restaurantId);
        mockReview.setRating(4);
        mockReview.setComment("Great experience!");

        mockRequest = new CreateReviewRequest();
        mockRequest.setRestaurantId(restaurantId);
        mockRequest.setRating(4);
        mockRequest.setComment("Great experience!");
    }

    @Test
    void createReview_ShouldCreateAndReturnReview() {
        // Arrange
        when(reviewRepository.save(any(Review.class))).thenReturn(mockReview);
        doNothing().when(restaurantService).updateRestaurantRatingStatsAsync(any(ObjectId.class));

        // Act
        Review result = reviewService.createReview(mockRequest, customerId);

        // Assert
        assertNotNull(result);
        assertEquals(mockReview, result);
        verify(reviewRepository).save(any(Review.class));
        verify(restaurantService).updateRestaurantRatingStatsAsync(restaurantId);
    }

    @Test
    void updateReview_ShouldUpdateAndReturnReview() {
        // Arrange
        CreateReviewRequest updateRequest = new CreateReviewRequest();
        updateRequest.setRestaurantId(restaurantId);
        updateRequest.setRating(5);
        updateRequest.setComment("Updated review");

        Review updatedReview = new Review();
        updatedReview.setId(reviewId);
        updatedReview.setCustomerId(customerId);
        updatedReview.setRestaurantId(restaurantId);
        updatedReview.setRating(5);
        updatedReview.setComment("Updated review");

        when(reviewRepository.findByIdAndCustomerId(reviewId, customerId))
                .thenReturn(Optional.of(mockReview));
        when(reviewRepository.save(any(Review.class))).thenReturn(updatedReview);
        doNothing().when(restaurantService).updateRestaurantRatingStatsAsync(any(ObjectId.class));

        // Act
        Optional<Review> result = reviewService.updateReview(reviewId, updateRequest, customerId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(5, result.get().getRating());
        assertEquals("Updated review", result.get().getComment());
        verify(reviewRepository).save(any(Review.class));
        verify(restaurantService).updateRestaurantRatingStatsAsync(restaurantId);
    }

    @Test
    void updateReview_ShouldReturnEmpty_WhenReviewNotFound() {
        // Arrange
        when(reviewRepository.findByIdAndCustomerId(any(), any())).thenReturn(Optional.empty());

        // Act
        Optional<Review> result = reviewService.updateReview(reviewId, mockRequest, customerId);

        // Assert
        assertTrue(result.isEmpty());
        verify(reviewRepository, never()).save(any());
        verify(restaurantService, never()).updateRestaurantRatingStatsAsync(any());
    }

    @Test
    void deleteReview_ShouldDeleteAndReturnTrue() {
        // Arrange
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));
        doNothing().when(reviewRepository).deleteById(reviewId);
        doNothing().when(restaurantService).updateRestaurantRatingStatsAsync(any(ObjectId.class));

        // Act
        boolean result = reviewService.deleteReview(reviewId);

        // Assert
        assertTrue(result);
        verify(reviewRepository).deleteById(reviewId);
        verify(restaurantService).updateRestaurantRatingStatsAsync(restaurantId);
    }

    @Test
    void deleteReview_ShouldReturnFalse_WhenReviewNotFound() {
        // Arrange
        when(reviewRepository.findById(any())).thenReturn(Optional.empty());

        // Act
        boolean result = reviewService.deleteReview(reviewId);

        // Assert
        assertFalse(result);
        verify(reviewRepository, never()).deleteById(any());
        verify(restaurantService, never()).updateRestaurantRatingStatsAsync(any());
    }

    @Test
    void getReviewsForRestaurant_ShouldReturnPaginatedReviews() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> mockPage = new PageImpl<>(Collections.singletonList(mockReview));
        when(reviewRepository.findByRestaurantId(restaurantId, pageable)).thenReturn(mockPage);

        // Act
        Page<Review> result = reviewService.getReviewsForRestaurant(restaurantId, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(mockReview, result.getContent().get(0));
        verify(reviewRepository).findByRestaurantId(restaurantId, pageable);
    }
} 
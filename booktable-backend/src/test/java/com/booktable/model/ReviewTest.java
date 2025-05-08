package com.booktable.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

class ReviewTest {

    @Test
    void testReviewCreation_WithAllFields() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId customerId = new ObjectId();
        int rating = 5;
        String comment = "Great restaurant!";
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Review review = new Review(id, restaurantId, customerId, rating, comment, createdAt);

        // Assert
        assertEquals(id, review.getId());
        assertEquals(restaurantId, review.getRestaurantId());
        assertEquals(customerId, review.getCustomerId());
        assertEquals(rating, review.getRating());
        assertEquals(comment, review.getComment());
        assertEquals(createdAt, review.getCreatedAt());
    }

    @Test
    void testReviewCreation_WithMinimumRating() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId customerId = new ObjectId();
        int rating = 1;
        String comment = "Poor experience";
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Review review = new Review(id, restaurantId, customerId, rating, comment, createdAt);

        // Assert
        assertEquals(id, review.getId());
        assertEquals(restaurantId, review.getRestaurantId());
        assertEquals(customerId, review.getCustomerId());
        assertEquals(rating, review.getRating());
        assertEquals(comment, review.getComment());
        assertEquals(createdAt, review.getCreatedAt());
    }

    @Test
    void testReviewCreation_WithMaximumRating() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId customerId = new ObjectId();
        int rating = 5;
        String comment = "Excellent experience";
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Review review = new Review(id, restaurantId, customerId, rating, comment, createdAt);

        // Assert
        assertEquals(id, review.getId());
        assertEquals(restaurantId, review.getRestaurantId());
        assertEquals(customerId, review.getCustomerId());
        assertEquals(rating, review.getRating());
        assertEquals(comment, review.getComment());
        assertEquals(createdAt, review.getCreatedAt());
    }

    @Test
    void testReviewCreation_WithEmptyComment() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId customerId = new ObjectId();
        int rating = 4;
        String comment = "";
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Review review = new Review(id, restaurantId, customerId, rating, comment, createdAt);

        // Assert
        assertEquals(id, review.getId());
        assertEquals(restaurantId, review.getRestaurantId());
        assertEquals(customerId, review.getCustomerId());
        assertEquals(rating, review.getRating());
        assertEquals(comment, review.getComment());
        assertEquals(createdAt, review.getCreatedAt());
    }

    @Test
    void testReviewCreation_WithNoArgsConstructor() {
        // Act
        Review review = new Review();

        // Assert
        assertNull(review.getId());
        assertNull(review.getRestaurantId());
        assertNull(review.getCustomerId());
        assertEquals(0, review.getRating());
        assertNull(review.getComment());
        assertNull(review.getCreatedAt());
    }
} 
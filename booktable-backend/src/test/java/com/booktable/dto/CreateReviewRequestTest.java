package com.booktable.dto;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class CreateReviewRequestTest {

    @Test
    void testAllFields() {
        CreateReviewRequest request = new CreateReviewRequest();
        ObjectId restaurantId = new ObjectId();
        
        request.setRestaurantId(restaurantId);
        request.setRating(4);
        request.setComment("Great experience!");

        assertEquals(restaurantId, request.getRestaurantId());
        assertEquals(4, request.getRating());
        assertEquals("Great experience!", request.getComment());
    }

    @Test
    void testEmptyComment() {
        CreateReviewRequest request = new CreateReviewRequest();
        ObjectId restaurantId = new ObjectId();
        
        request.setRestaurantId(restaurantId);
        request.setRating(5);
        request.setComment("");

        assertEquals(restaurantId, request.getRestaurantId());
        assertEquals(5, request.getRating());
        assertEquals("", request.getComment());
    }

    @Test
    void testNullFields() {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRestaurantId(null);
        request.setRating(null);
        request.setComment(null);

        assertNull(request.getRestaurantId());
        assertNull(request.getRating());
        assertNull(request.getComment());
    }
} 
package com.booktable.dto;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ReviewsByRestaurantRequestTest {

    @Test
    void testDefaultValues() {
        ReviewsByRestaurantRequest request = new ReviewsByRestaurantRequest();

        assertEquals(0, request.getPage());
        assertEquals(10, request.getSize());
        assertEquals(Sort.Direction.DESC, request.getDirection());
        assertEquals("createdAt", request.getSortProperty());
    }

    @Test
    void testCustomValues() {
        ReviewsByRestaurantRequest request = new ReviewsByRestaurantRequest();
        request.setPage(2);
        request.setSize(20);
        request.setDirection(Sort.Direction.ASC);
        request.setSortProperty("rating");

        assertEquals(2, request.getPage());
        assertEquals(20, request.getSize());
        assertEquals(Sort.Direction.ASC, request.getDirection());
        assertEquals("rating", request.getSortProperty());
    }

    @Test
    void testZeroValues() {
        ReviewsByRestaurantRequest request = new ReviewsByRestaurantRequest();
        request.setPage(0);
        request.setSize(0);

        assertEquals(0, request.getPage());
        assertEquals(0, request.getSize());
    }
} 
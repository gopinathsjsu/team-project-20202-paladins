package com.booktable.dto;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class RatingStatsTest {

    @Test
    void testAllFields() {
        RatingStats stats = new RatingStats();
        ObjectId id = new ObjectId();
        
        stats.setId(id);
        stats.setAverageRating(4.5);
        stats.setCount(10);

        assertEquals(id, stats.getId());
        assertEquals(4.5, stats.getAverageRating());
        assertEquals(10, stats.getCount());
    }

    @Test
    void testZeroValues() {
        RatingStats stats = new RatingStats();
        stats.setId(null);
        stats.setAverageRating(0.0);
        stats.setCount(0);

        assertNull(stats.getId());
        assertEquals(0.0, stats.getAverageRating());
        assertEquals(0, stats.getCount());
    }

    @Test
    void testNullFields() {
        RatingStats stats = new RatingStats();
        stats.setId(null);
        stats.setAverageRating(null);
        stats.setCount(null);

        assertNull(stats.getId());
        assertNull(stats.getAverageRating());
        assertNull(stats.getCount());
    }
} 
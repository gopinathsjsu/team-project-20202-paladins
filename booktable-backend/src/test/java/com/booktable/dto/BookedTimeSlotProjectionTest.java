package com.booktable.dto;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class BookedTimeSlotProjectionTest {

    @Test
    void testAllFields() {
        ObjectId tableId = new ObjectId();
        LocalTime startTime = LocalTime.of(12, 0);
        LocalTime endTime = LocalTime.of(13, 0);

        BookedTimeSlotProjection projection = new BookedTimeSlotProjection(
            tableId,
            startTime,
            endTime
        );

        assertEquals(tableId, projection.getTableId());
        assertEquals(startTime, projection.getStartSlotTime());
        assertEquals(endTime, projection.getEndSlotTime());
    }

    @Test
    void testNullFields() {
        BookedTimeSlotProjection projection = new BookedTimeSlotProjection(
            null,
            null,
            null
        );

        assertNull(projection.getTableId());
        assertNull(projection.getStartSlotTime());
        assertNull(projection.getEndSlotTime());
    }
} 
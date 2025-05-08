package com.booktable.dto;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class BookingDtoTest {

    @Test
    void testAllFields() {
        ObjectId restaurantId = new ObjectId();
        ObjectId tableId = new ObjectId();
        ObjectId reservationId = new ObjectId();
        LocalTime startTime = LocalTime.of(12, 0);
        LocalTime endTime = LocalTime.of(13, 0);
        LocalDate date = LocalDate.now();

        BookingDto dto = new BookingDto(
            restaurantId,
            tableId,
            startTime,
            endTime,
            date
        );
        dto.setReservationId(reservationId);
        dto.setTableNumber("1");
        dto.setRestaurantName("Test Restaurant");
        dto.setStatus("CONFIRMED");

        assertEquals(restaurantId, dto.getRestaurantId());
        assertEquals(tableId, dto.getTableId());
        assertEquals(startTime, dto.getStartSlotTime());
        assertEquals(endTime, dto.getEndSlotTime());
        assertEquals(date, dto.getDate());
        assertEquals(reservationId, dto.getReservationId());
        assertEquals("1", dto.getTableNumber());
        assertEquals("Test Restaurant", dto.getRestaurantName());
        assertEquals("CONFIRMED", dto.getStatus());
    }

    @Test
    void testNullOptionalFields() {
        ObjectId restaurantId = new ObjectId();
        ObjectId tableId = new ObjectId();
        LocalTime startTime = LocalTime.of(12, 0);
        LocalTime endTime = LocalTime.of(13, 0);
        LocalDate date = LocalDate.now();

        BookingDto dto = new BookingDto(
            restaurantId,
            tableId,
            startTime,
            endTime,
            date
        );
        dto.setReservationId(null);
        dto.setTableNumber(null);
        dto.setRestaurantName(null);
        dto.setStatus(null);

        assertEquals(restaurantId, dto.getRestaurantId());
        assertEquals(tableId, dto.getTableId());
        assertEquals(startTime, dto.getStartSlotTime());
        assertEquals(endTime, dto.getEndSlotTime());
        assertEquals(date, dto.getDate());
        assertNull(dto.getReservationId());
        assertNull(dto.getTableNumber());
        assertNull(dto.getRestaurantName());
        assertNull(dto.getStatus());
    }
} 
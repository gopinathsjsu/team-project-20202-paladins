package com.booktable.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ReservationTest {

    @Test
    void testReservationCreation_WithAllFields() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId customerId = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId tableId = new ObjectId();
        LocalDate date = LocalDate.now();
        LocalTime startSlotTime = LocalTime.of(18, 0);
        LocalTime endSlotTime = LocalTime.of(20, 0);
        int partySize = 4;
        String status = Reservation.STATUS_CONFIRMED;
        BigDecimal totalAmount = new BigDecimal("100.00");
        LocalDateTime createdAt = LocalDateTime.now();

        // Act
        Reservation reservation = Reservation.builder()
                .id(id)
                .customerId(customerId)
                .restaurantId(restaurantId)
                .tableId(tableId)
                .date(date)
                .startSlotTime(startSlotTime)
                .endSlotTime(endSlotTime)
                .partySize(partySize)
                .status(status)
                .totalAmount(totalAmount)
                .createdAt(createdAt)
                .build();

        // Assert
        assertEquals(id, reservation.getId());
        assertEquals(customerId, reservation.getCustomerId());
        assertEquals(restaurantId, reservation.getRestaurantId());
        assertEquals(tableId, reservation.getTableId());
        assertEquals(date, reservation.getDate());
        assertEquals(startSlotTime, reservation.getStartSlotTime());
        assertEquals(endSlotTime, reservation.getEndSlotTime());
        assertEquals(partySize, reservation.getPartySize());
        assertEquals(status, reservation.getStatus());
        assertEquals(totalAmount, reservation.getTotalAmount());
        assertEquals(createdAt, reservation.getCreatedAt());
    }

    @Test
    void testReservationCreation_WithCancelledStatus() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId customerId = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        ObjectId tableId = new ObjectId();
        LocalDate date = LocalDate.now();
        LocalTime startSlotTime = LocalTime.of(18, 0);
        LocalTime endSlotTime = LocalTime.of(20, 0);
        int partySize = 4;
        String status = Reservation.STATUS_CANCELLED;
        BigDecimal totalAmount = new BigDecimal("100.00");

        // Act
        Reservation reservation = Reservation.builder()
                .id(id)
                .customerId(customerId)
                .restaurantId(restaurantId)
                .tableId(tableId)
                .date(date)
                .startSlotTime(startSlotTime)
                .endSlotTime(endSlotTime)
                .partySize(partySize)
                .status(status)
                .totalAmount(totalAmount)
                .build();

        // Assert
        assertEquals(id, reservation.getId());
        assertEquals(customerId, reservation.getCustomerId());
        assertEquals(restaurantId, reservation.getRestaurantId());
        assertEquals(tableId, reservation.getTableId());
        assertEquals(date, reservation.getDate());
        assertEquals(startSlotTime, reservation.getStartSlotTime());
        assertEquals(endSlotTime, reservation.getEndSlotTime());
        assertEquals(partySize, reservation.getPartySize());
        assertEquals(status, reservation.getStatus());
        assertEquals(totalAmount, reservation.getTotalAmount());
        assertNull(reservation.getCreatedAt());
    }

    @Test
    void testReservationCreation_WithNoArgsConstructor() {
        // Act
        Reservation reservation = new Reservation();

        // Assert
        assertNull(reservation.getId());
        assertNull(reservation.getCustomerId());
        assertNull(reservation.getRestaurantId());
        assertNull(reservation.getTableId());
        assertNull(reservation.getDate());
        assertNull(reservation.getStartSlotTime());
        assertNull(reservation.getEndSlotTime());
        assertEquals(0, reservation.getPartySize());
        assertNull(reservation.getStatus());
        assertNull(reservation.getTotalAmount());
        assertNull(reservation.getCreatedAt());
    }

    @Test
    void testReservationConstants() {
        // Assert
        assertEquals("CONFIRMED", Reservation.STATUS_CONFIRMED);
        assertEquals("CANCELLED", Reservation.STATUS_CANCELLED);
    }
} 
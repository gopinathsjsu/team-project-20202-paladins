package com.booktable.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TableTest {

    @Test
    void testTableCreation_WithAllFields() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        String tableNumber = "T1";
        Integer capacity = 4;
        Boolean isActive = true;

        // Act
        Table table = new Table(id, restaurantId, tableNumber, capacity, isActive);

        // Assert
        assertEquals(id, table.getId());
        assertEquals(restaurantId, table.getRestaurantId());
        assertEquals(tableNumber, table.getTableNumber());
        assertEquals(capacity, table.getCapacity());
        assertEquals(isActive, table.getIsActive());
    }

    @Test
    void testTableCreation_WithInactiveStatus() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        String tableNumber = "T2";
        Integer capacity = 6;
        Boolean isActive = false;

        // Act
        Table table = new Table(id, restaurantId, tableNumber, capacity, isActive);

        // Assert
        assertEquals(id, table.getId());
        assertEquals(restaurantId, table.getRestaurantId());
        assertEquals(tableNumber, table.getTableNumber());
        assertEquals(capacity, table.getCapacity());
        assertEquals(isActive, table.getIsActive());
    }

    @Test
    void testTableCreation_WithLargeCapacity() {
        // Arrange
        ObjectId id = new ObjectId();
        ObjectId restaurantId = new ObjectId();
        String tableNumber = "T3";
        Integer capacity = 12;
        Boolean isActive = true;

        // Act
        Table table = new Table(id, restaurantId, tableNumber, capacity, isActive);

        // Assert
        assertEquals(id, table.getId());
        assertEquals(restaurantId, table.getRestaurantId());
        assertEquals(tableNumber, table.getTableNumber());
        assertEquals(capacity, table.getCapacity());
        assertEquals(isActive, table.getIsActive());
    }

    @Test
    void testTableCreation_WithNoArgsConstructor() {
        // Act
        Table table = new Table();

        // Assert
        assertNull(table.getId());
        assertNull(table.getRestaurantId());
        assertNull(table.getTableNumber());
        assertNull(table.getCapacity());
        assertNull(table.getIsActive());
    }
} 
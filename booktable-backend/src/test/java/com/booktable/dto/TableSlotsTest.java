package com.booktable.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TableSlotsTest {

    @Test
    void testAllFields() {
        TableSlots slots = new TableSlots();
        slots.setTableId("1");
        slots.setSlot(Arrays.asList(
            LocalTime.of(12, 0),
            LocalTime.of(13, 0),
            LocalTime.of(14, 0)
        ));

        assertEquals("1", slots.getTableId());
        assertNotNull(slots.getSlot());
        assertEquals(3, slots.getSlot().size());
        assertEquals(LocalTime.of(12, 0), slots.getSlot().get(0));
        assertEquals(LocalTime.of(13, 0), slots.getSlot().get(1));
        assertEquals(LocalTime.of(14, 0), slots.getSlot().get(2));
    }

    @Test
    void testEmptySlot() {
        TableSlots slots = new TableSlots();
        slots.setTableId("1");
        slots.setSlot(List.of());

        assertEquals("1", slots.getTableId());
        assertNotNull(slots.getSlot());
        assertTrue(slots.getSlot().isEmpty());
    }

    @Test
    void testNullFields() {
        TableSlots slots = new TableSlots();
        slots.setTableId(null);
        slots.setSlot(null);

        assertNull(slots.getTableId());
        assertNull(slots.getSlot());
    }
} 
package com.booktable.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TableDetailsTest {

    @Test
    void testAllFields() {
        TableDetails details = new TableDetails();
        details.setCapacity(4);
        details.setCount(5);

        assertEquals(4, details.getCapacity());
        assertEquals(5, details.getCount());
    }

    @Test
    void testZeroValues() {
        TableDetails details = new TableDetails();
        details.setCapacity(0);
        details.setCount(0);

        assertEquals(0, details.getCapacity());
        assertEquals(0, details.getCount());
    }

    @Test
    void testNullValues() {
        TableDetails details = new TableDetails();
        details.setCapacity(null);
        details.setCount(null);

        assertNull(details.getCapacity());
        assertNull(details.getCount());
    }
} 
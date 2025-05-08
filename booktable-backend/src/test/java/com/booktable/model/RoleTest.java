package com.booktable.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    @Test
    void testRoleValues() {
        // Assert
        assertEquals("CUSTOMER", Role.CUSTOMER.name());
        assertEquals("RESTAURANT_MANAGER", Role.RESTAURANT_MANAGER.name());
        assertEquals("ADMIN", Role.ADMIN.name());
    }

    @Test
    void testGetAuthority() {
        // Assert
        assertEquals("CUSTOMER", Role.CUSTOMER.getAuthority());
        assertEquals("RESTAURANT_MANAGER", Role.RESTAURANT_MANAGER.getAuthority());
        assertEquals("ADMIN", Role.ADMIN.getAuthority());
    }


} 
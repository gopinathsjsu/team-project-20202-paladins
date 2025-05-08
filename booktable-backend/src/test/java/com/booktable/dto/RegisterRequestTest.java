package com.booktable.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {

    @Test
    void testAllFields() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        assertEquals("John Doe", request.getName());
        assertEquals("john@example.com", request.getEmail());
        assertEquals("password123", request.getPassword());
    }

    @Test
    void testEmptyFields() {
        RegisterRequest request = new RegisterRequest();
        request.setName("");
        request.setEmail("");
        request.setPassword("");

        assertEquals("", request.getName());
        assertEquals("", request.getEmail());
        assertEquals("", request.getPassword());
    }

    @Test
    void testNullFields() {
        RegisterRequest request = new RegisterRequest();
        request.setName(null);
        request.setEmail(null);
        request.setPassword(null);

        assertNull(request.getName());
        assertNull(request.getEmail());
        assertNull(request.getPassword());
    }
} 
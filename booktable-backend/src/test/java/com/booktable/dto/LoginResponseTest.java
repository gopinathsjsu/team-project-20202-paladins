package com.booktable.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class LoginResponseTest {

    @Test
    void testAllArgsConstructor() {
        LoginResponse response = new LoginResponse("jwt.token", "user@example.com", "CUSTOMER");

        assertEquals("jwt.token", response.getToken());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void testSettersAndGetters() {
        LoginResponse response = new LoginResponse(null, null, null);
        
        response.setToken("jwt.token");
        response.setEmail("user@example.com");
        response.setRole("CUSTOMER");

        assertEquals("jwt.token", response.getToken());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void testNullFields() {
        LoginResponse response = new LoginResponse(null, null, null);

        assertNull(response.getToken());
        assertNull(response.getEmail());
        assertNull(response.getRole());
    }
} 
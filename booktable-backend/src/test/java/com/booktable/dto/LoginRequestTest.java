package com.booktable.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LoginRequestTest {

    @Test
    void testEmailAndPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("secret");

        assertEquals("user@example.com", loginRequest.getEmail());
        assertEquals("secret", loginRequest.getPassword());
    }
}

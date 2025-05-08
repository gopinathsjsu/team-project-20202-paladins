package com.booktable.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil("testsecretkey123456789012345678901234567890", 86400000);

    @Test
    void testGenerateAndValidateToken() {
        String email = "testuser@example.com";
        String role = "CUSTOMER";

        String token = jwtUtil.generateToken(email, role);

        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals(email, jwtUtil.extractEmail(token));
    }
}

package com.booktable.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.config.name=application-test")
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testGenerateAndValidateToken() {
        String email = "test@example.com";
        String role = "CUSTOMER";

        String token = jwtUtil.generateToken(email, role);

        assertNotNull(token, "Token should not be null");
        assertTrue(jwtUtil.validateToken(token), "Token should be valid");
        assertEquals(email, jwtUtil.extractEmail(token), "Email should match");
        assertEquals(role, jwtUtil.extractRole(token), "Role should match");
    }

    @Test
    void testInvalidToken() {
        String invalidToken = "this.is.not.a.valid.token";
        assertFalse(jwtUtil.validateToken(invalidToken), "Invalid token should fail validation");
    }
}

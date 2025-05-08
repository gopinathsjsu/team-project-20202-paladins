package com.booktable.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthProviderTest {

    @Test
    void testAuthProviderValues() {
        // Assert
        assertEquals("LOCAL", AuthProvider.LOCAL.name());
        assertEquals("GOOGLE", AuthProvider.GOOGLE.name());
    }

    @Test
    void testAuthProviderEnumValues() {
        // Assert
        assertEquals(2, AuthProvider.values().length);
        assertArrayEquals(new AuthProvider[]{AuthProvider.LOCAL, AuthProvider.GOOGLE}, AuthProvider.values());
    }

    @Test
    void testAuthProviderValueOf() {
        // Assert
        assertEquals(AuthProvider.LOCAL, AuthProvider.valueOf("LOCAL"));
        assertEquals(AuthProvider.GOOGLE, AuthProvider.valueOf("GOOGLE"));
    }
} 
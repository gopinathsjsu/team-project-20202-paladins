package com.booktable.model;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserCreation_WithAllFields() {
        // Arrange
        String id = "user123";
        String name = "John Doe";
        String email = "john@example.com";
        String password = "password123";
        Set<Role> roles = new HashSet<>(Set.of(Role.CUSTOMER));
        AuthProvider provider = AuthProvider.LOCAL;

        // Act
        User user = User.builder()
                .id(id)
                .name(name)
                .email(email)
                .password(password)
                .roles(roles)
                .provider(provider)
                .build();

        // Assert
        assertEquals(id, user.getId());
        assertEquals(name, user.getName());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertEquals(roles, user.getRoles());
        assertEquals(provider, user.getProvider());
        assertEquals(email, user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
        assertEquals(roles, user.getAuthorities());
    }

    @Test
    void testUserCreation_WithGoogleProvider() {
        // Arrange
        String id = "user123";
        String name = "John Doe";
        String email = "john@gmail.com";
        Set<Role> roles = new HashSet<>(Set.of(Role.CUSTOMER));
        AuthProvider provider = AuthProvider.GOOGLE;

        // Act
        User user = User.builder()
                .id(id)
                .name(name)
                .email(email)
                .roles(roles)
                .provider(provider)
                .build();

        // Assert
        assertEquals(id, user.getId());
        assertEquals(name, user.getName());
        assertEquals(email, user.getEmail());
        assertNull(user.getPassword()); // Password should be null for Google auth
        assertEquals(roles, user.getRoles());
        assertEquals(provider, user.getProvider());
        assertEquals(email, user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
        assertEquals(roles, user.getAuthorities());
    }

    @Test
    void testUserCreation_WithMultipleRoles() {
        // Arrange
        String id = "admin123";
        String name = "Admin User";
        String email = "admin@example.com";
        String password = "admin123";
        Set<Role> roles = new HashSet<>(Set.of(Role.ADMIN, Role.RESTAURANT_MANAGER));
        AuthProvider provider = AuthProvider.LOCAL;

        // Act
        User user = User.builder()
                .id(id)
                .name(name)
                .email(email)
                .password(password)
                .roles(roles)
                .provider(provider)
                .build();

        // Assert
        assertEquals(id, user.getId());
        assertEquals(name, user.getName());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertEquals(roles, user.getRoles());
        assertEquals(provider, user.getProvider());
        assertEquals(email, user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
        assertEquals(roles, user.getAuthorities());
    }

    @Test
    void testUserCreation_WithNoArgsConstructor() {
        // Act
        User user = new User();

        // Assert
        assertNull(user.getId());
        assertNull(user.getName());
        assertNull(user.getEmail());
        assertNull(user.getPassword());
        assertNull(user.getRoles());
        assertNull(user.getProvider());
        assertNull(user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
        assertNull(user.getAuthorities());
    }
} 
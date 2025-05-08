package com.booktable.controller;

import com.booktable.model.Restaurant;
import com.booktable.service.AdminService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private ObjectId restaurantId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        restaurantId = new ObjectId();
    }

    @Test
    void viewAdminDashboard_ShouldReturnWelcomeMessage() {
        // Act
        String result = adminController.viewAdminDashboard();

        // Assert
        assertEquals("Welcome to the Admin Dashboard", result);
    }

    @Test
    void getPendingRestaurants_ShouldReturnPendingRestaurants() {
        // Arrange
        List<Restaurant> mockRestaurants = Arrays.asList(
            new Restaurant(), new Restaurant()
        );
        when(adminService.getPendingRestaurants()).thenReturn(mockRestaurants);

        // Act
        ResponseEntity<List<Restaurant>> response = adminController.getPendingRestaurants();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(adminService).getPendingRestaurants();
    }

    @Test
    void getPendingRestaurants_ShouldReturnEmptyList_WhenNoPendingRestaurants() {
        // Arrange
        when(adminService.getPendingRestaurants()).thenReturn(Collections.emptyList());

        // Act
        ResponseEntity<List<Restaurant>> response = adminController.getPendingRestaurants();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
        verify(adminService).getPendingRestaurants();
    }

    @Test
    void approveRestaurant_ShouldApproveRestaurant() {
        // Arrange
        when(adminService.approveRestaurant(restaurantId.toHexString())).thenReturn(true);

        // Act
        ResponseEntity<String> response = adminController.approveRestaurant(restaurantId.toHexString());

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Restaurant approved successfully", response.getBody());
        verify(adminService).approveRestaurant(restaurantId.toHexString());
    }

    @Test
    void approveRestaurant_ShouldReturnNotFound_WhenRestaurantNotFound() {
        // Arrange
        when(adminService.approveRestaurant(restaurantId.toHexString())).thenReturn(false);

        // Act
        ResponseEntity<String> response = adminController.approveRestaurant(restaurantId.toHexString());

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Restaurant not found", response.getBody());
        verify(adminService).approveRestaurant(restaurantId.toHexString());
    }
} 
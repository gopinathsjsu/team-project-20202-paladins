package com.booktable.service;

import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @InjectMocks
    private AdminService adminService;

    private ObjectId restaurantId;
    private Restaurant mockRestaurant;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        restaurantId = new ObjectId();

        mockRestaurant = new Restaurant();
        mockRestaurant.setId(restaurantId);
        mockRestaurant.setName("Test Restaurant");
        mockRestaurant.setApproved(false);
    }

    @Test
    void getPendingRestaurants_ShouldReturnPendingRestaurants() {
        // Arrange
        when(restaurantRepository.findByApprovedFalse())
            .thenReturn(Collections.singletonList(mockRestaurant));

        // Act
        List<Restaurant> result = adminService.getPendingRestaurants();

        // Assert
        assertNotNull(result, "Result should not be null");
        assertEquals(1, result.size(), "Result size should be 1");
        assertEquals(mockRestaurant, result.get(0), "Returned restaurant should match the mock restaurant");
        verify(restaurantRepository, times(1)).findByApprovedFalse();
    }

    @Test
    void getPendingRestaurants_ShouldReturnEmptyList_WhenNoPendingRestaurants() {
        // Arrange
        when(restaurantRepository.findByApprovedFalse())
            .thenReturn(Collections.emptyList());

        // Act
        List<Restaurant> result = adminService.getPendingRestaurants();

        // Assert
        assertNotNull(result, "Result should not be null");
        assertTrue(result.isEmpty(), "Result should be an empty list");
        verify(restaurantRepository, times(1)).findByApprovedFalse();
    }

    @Test
    void approveRestaurant_ShouldApproveRestaurant() {
        // Arrange
        when(restaurantRepository.findById(restaurantId.toHexString()))
            .thenReturn(Optional.of(mockRestaurant));
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(mockRestaurant);

        // Act
        boolean result = adminService.approveRestaurant(restaurantId.toHexString());

        // Assert
        assertTrue(result, "Approval result should be true");
        assertTrue(mockRestaurant.isApproved(), "Restaurant should be marked as approved");
        verify(restaurantRepository, times(1)).findById(restaurantId.toHexString());
        verify(restaurantRepository, times(1)).save(mockRestaurant);
    }

    @Test
    void approveRestaurant_ShouldReturnFalse_WhenRestaurantNotFound() {
        // Arrange
        when(restaurantRepository.findById(any())).thenReturn(Optional.empty());

        // Act
        boolean result = adminService.approveRestaurant(restaurantId.toHexString());

        // Assert
        assertFalse(result, "Approval result should be false");
        verify(restaurantRepository, times(1)).findById(restaurantId.toHexString());
        verify(restaurantRepository, never()).save(any());
    }
} 

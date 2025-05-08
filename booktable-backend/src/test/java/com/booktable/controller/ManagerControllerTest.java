package com.booktable.controller;

import com.booktable.model.Restaurant;
import com.booktable.model.User;
import com.booktable.service.RestaurantService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ManagerControllerTest {

    @Mock
    private RestaurantService restaurantService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ManagerController managerController;

    private User mockUser;
    private ObjectId managerId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);

        // Setup mock user
        managerId = new ObjectId();
        mockUser = new User();
        mockUser.setId(managerId.toHexString());
    }

    @Test
    void viewManagerListings_ShouldReturnManagerRestaurants() {
        // Arrange
        List<Restaurant> mockRestaurants = Arrays.asList(
                new Restaurant(), new Restaurant()
        );
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(restaurantService.getRestaurantsByManagerId(managerId.toHexString()))
                .thenReturn(mockRestaurants);

        // Act
        List<Restaurant> result = managerController.viewManagerListings();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(restaurantService).getRestaurantsByManagerId(managerId.toHexString());
    }

    @Test
    void viewManagerListings_ShouldReturnEmptyList_WhenNoRestaurants() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(restaurantService.getRestaurantsByManagerId(managerId.toHexString()))
                .thenReturn(Collections.emptyList());

        // Act
        List<Restaurant> result = managerController.viewManagerListings();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(restaurantService).getRestaurantsByManagerId(managerId.toHexString());
    }
} 
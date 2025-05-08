package com.booktable.controller;

import com.booktable.mapper.RestaurantMapper;
import com.booktable.model.Restaurant;
import com.booktable.service.ReservationService;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RestaurantControllerTest {

    @Mock
    private RestaurantService restaurantService;

    @Mock
    private TableService tableService;

    @Mock
    private RestaurantMapper restaurantMapper;

    @Mock
    private ReservationService reservationService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private RestaurantController restaurantController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }



    @Test
    void listRestaurants_ShouldReturnPaginatedRestaurants() {
        // Arrange
        int page = 0;
        int size = 10;
        List<Restaurant> mockRestaurants = Arrays.asList(
            new Restaurant(), new Restaurant()
        );

        when(restaurantService.listRestaurants(page, size)).thenReturn(mockRestaurants);

        // Act
        List<Restaurant> result = restaurantController.listRestaurants(page, size);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(restaurantService).listRestaurants(page, size);
    }



    @Test
    void patchRestaurant_ShouldPartiallyUpdateRestaurant() {
        // Arrange
        ObjectId restaurantId = new ObjectId();
        Restaurant input = new Restaurant();
        input.setId(restaurantId);
        input.setName("Updated Name");

        when(restaurantService.patchRestaurant(restaurantId.toHexString(), input)).thenReturn(input);

        // Act
        Restaurant result = restaurantController.patchRestaurant(restaurantId.toHexString(), input);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        verify(restaurantService).patchRestaurant(restaurantId.toHexString(), input);
    }


} 
package com.booktable.mapper;

import com.booktable.dto.RestaurantInput;
import com.booktable.model.Restaurant;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class RestaurantUpdateMapperTest {

    private final RestaurantUpdateMapper mapper = new RestaurantUpdateMapper();

    @Test
    void testUpdateEntity_WithAllFields() {
        // Arrange
        RestaurantInput input = new RestaurantInput();
        input.setName("Updated Restaurant");
        input.setDescription("An updated restaurant");
        input.setAddressStreet("456 Update St");
        input.setAddressCity("Update City");
        input.setAddressState("Update State");
        input.setAddressZip("54321");
        input.setPhone("987-654-3210");
        input.setEmail("updated@restaurant.com");
        input.setImageUrl("http://test.com/updated.jpg");
        input.setCoordinatesLatitude(new BigDecimal("41.7128"));
        input.setCoordinatesLongitude(new BigDecimal("-75.0060"));
        input.setCuisines(Arrays.asList("Mexican", "Tacos"));
        input.setOpeningHour(LocalTime.of(10, 0));
        input.setClosingHour(LocalTime.of(23, 0));
        input.setCost("$$$");

        Restaurant existingRestaurant = new Restaurant();
        existingRestaurant.setName("Old Restaurant");
        existingRestaurant.setDescription("Old description");
        existingRestaurant.setAddressStreet("Old St");
        existingRestaurant.setAddressCity("Old City");
        existingRestaurant.setAddressState("Old State");
        existingRestaurant.setAddressZip("12345");
        existingRestaurant.setPhone("123-456-7890");
        existingRestaurant.setEmail("old@restaurant.com");
        existingRestaurant.setImageUrl("http://test.com/old.jpg");
        existingRestaurant.setCoordinatesLatitude(new BigDecimal("40.7128"));
        existingRestaurant.setCoordinatesLongitude(new BigDecimal("-74.0060"));
        existingRestaurant.setCuisines(Arrays.asList("Italian", "Pizza"));
        existingRestaurant.setOpeningHour(LocalTime.of(9, 0));
        existingRestaurant.setClosingHour(LocalTime.of(22, 0));
        existingRestaurant.setCost("$");
        existingRestaurant.setManagerId("manager123");
        existingRestaurant.setApproved(true);

        // Act
        Restaurant result = mapper.updateEntity(input, existingRestaurant);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Restaurant", result.getName());
        assertEquals("An updated restaurant", result.getDescription());
        assertEquals("456 Update St", result.getAddressStreet());
        assertEquals("Update City", result.getAddressCity());
        assertEquals("Update State", result.getAddressState());
        assertEquals("54321", result.getAddressZip());
        assertEquals("987-654-3210", result.getPhone());
        assertEquals("updated@restaurant.com", result.getEmail());
        assertEquals("http://test.com/updated.jpg", result.getImageUrl());
        assertEquals(new BigDecimal("41.7128"), result.getCoordinatesLatitude());
        assertEquals(new BigDecimal("-75.0060"), result.getCoordinatesLongitude());
        assertEquals(Arrays.asList("Mexican", "Tacos"), result.getCuisines());
        assertEquals(LocalTime.of(10, 0), result.getOpeningHour());
        assertEquals(LocalTime.of(23, 0), result.getClosingHour());
        assertEquals("$$$", result.getCost());
        assertEquals("manager123", result.getManagerId());
        assertTrue(result.isApproved());
    }


}
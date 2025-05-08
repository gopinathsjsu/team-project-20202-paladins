package com.booktable.mapper;

import com.booktable.dto.RestaurantInput;
import com.booktable.model.Restaurant;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class RestaurantMapperTest {

    private final RestaurantMapper mapper = new RestaurantMapper();

    @Test
    void testToEntity_WithAllFields() {
        // Arrange
        RestaurantInput input = new RestaurantInput();
        input.setName("Test Restaurant");
        input.setDescription("A test restaurant");
        input.setAddressStreet("123 Test St");
        input.setAddressCity("Test City");
        input.setAddressState("Test State");
        input.setAddressZip("12345");
        input.setPhone("123-456-7890");
        input.setEmail("test@restaurant.com");
        input.setImageUrl("http://test.com/image.jpg");
        input.setCoordinatesLatitude(new BigDecimal("40.7128"));
        input.setCoordinatesLongitude(new BigDecimal("-74.0060"));
        input.setCuisines(Arrays.asList("Italian", "Pizza"));
        input.setOpeningHour(LocalTime.of(9, 0));
        input.setClosingHour(LocalTime.of(22, 0));
        input.setCost("$$");

        String managerId = "manager123";

        // Act
        Restaurant result = mapper.toEntity(input, managerId);

        // Assert
        assertNotNull(result);
        assertEquals("Test Restaurant", result.getName());
        assertEquals("A test restaurant", result.getDescription());
        assertEquals("123 Test St", result.getAddressStreet());
        assertEquals("Test City", result.getAddressCity());
        assertEquals("Test State", result.getAddressState());
        assertEquals("12345", result.getAddressZip());
        assertEquals("123-456-7890", result.getPhone());
        assertEquals("test@restaurant.com", result.getEmail());
        assertEquals("http://test.com/image.jpg", result.getImageUrl());
        assertEquals(new BigDecimal("40.7128"), result.getCoordinatesLatitude());
        assertEquals(new BigDecimal("-74.0060"), result.getCoordinatesLongitude());
        assertEquals(Arrays.asList("Italian", "Pizza"), result.getCuisines());
        assertEquals(LocalTime.of(9, 0), result.getOpeningHour());
        assertEquals(LocalTime.of(22, 0), result.getClosingHour());
        assertEquals("$$", result.getCost());
        assertEquals(managerId, result.getManagerId());
        assertFalse(result.isApproved());
    }


}
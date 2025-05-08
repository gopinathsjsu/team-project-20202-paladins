package com.booktable.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

class RestaurantInputTest {

    @Test
    void testAllFields() {
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

        assertEquals("Test Restaurant", input.getName());
        assertEquals("A test restaurant", input.getDescription());
        assertEquals("123 Test St", input.getAddressStreet());
        assertEquals("Test City", input.getAddressCity());
        assertEquals("Test State", input.getAddressState());
        assertEquals("12345", input.getAddressZip());
        assertEquals("123-456-7890", input.getPhone());
        assertEquals("test@restaurant.com", input.getEmail());
        assertEquals("http://test.com/image.jpg", input.getImageUrl());
        assertEquals(new BigDecimal("40.7128"), input.getCoordinatesLatitude());
        assertEquals(new BigDecimal("-74.0060"), input.getCoordinatesLongitude());
        assertEquals(Arrays.asList("Italian", "Pizza"), input.getCuisines());
        assertEquals(LocalTime.of(9, 0), input.getOpeningHour());
        assertEquals(LocalTime.of(22, 0), input.getClosingHour());
        assertEquals("$$", input.getCost());
    }

    @Test
    void testEmptyFields() {
        RestaurantInput input = new RestaurantInput();
        input.setName("");
        input.setDescription("");
        input.setAddressStreet("");
        input.setAddressCity("");
        input.setAddressState("");
        input.setAddressZip("");
        input.setPhone("");
        input.setEmail("");
        input.setImageUrl("");
        input.setCuisines(List.of());
        input.setCost("");

        assertEquals("", input.getName());
        assertEquals("", input.getDescription());
        assertEquals("", input.getAddressStreet());
        assertEquals("", input.getAddressCity());
        assertEquals("", input.getAddressState());
        assertEquals("", input.getAddressZip());
        assertEquals("", input.getPhone());
        assertEquals("", input.getEmail());
        assertEquals("", input.getImageUrl());
        assertEquals(List.of(), input.getCuisines());
        assertEquals("", input.getCost());
    }

    @Test
    void testNullFields() {
        RestaurantInput input = new RestaurantInput();
        input.setName(null);
        input.setDescription(null);
        input.setAddressStreet(null);
        input.setAddressCity(null);
        input.setAddressState(null);
        input.setAddressZip(null);
        input.setPhone(null);
        input.setEmail(null);
        input.setImageUrl(null);
        input.setCoordinatesLatitude(null);
        input.setCoordinatesLongitude(null);
        input.setCuisines(null);
        input.setOpeningHour(null);
        input.setClosingHour(null);
        input.setCost(null);

        assertNull(input.getName());
        assertNull(input.getDescription());
        assertNull(input.getAddressStreet());
        assertNull(input.getAddressCity());
        assertNull(input.getAddressState());
        assertNull(input.getAddressZip());
        assertNull(input.getPhone());
        assertNull(input.getEmail());
        assertNull(input.getImageUrl());
        assertNull(input.getCoordinatesLatitude());
        assertNull(input.getCoordinatesLongitude());
        assertNull(input.getCuisines());
        assertNull(input.getOpeningHour());
        assertNull(input.getClosingHour());
        assertNull(input.getCost());
    }
} 
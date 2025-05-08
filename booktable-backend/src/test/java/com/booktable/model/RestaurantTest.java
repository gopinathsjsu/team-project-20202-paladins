package com.booktable.model;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RestaurantTest {

    @Test
    void testRestaurantCreation_WithAllFields() {
        // Arrange
        ObjectId id = new ObjectId();
        String name = "Test Restaurant";
        String description = "A test restaurant";
        String addressStreet = "123 Test St";
        String addressCity = "Test City";
        String addressState = "Test State";
        String addressZip = "12345";
        String phone = "123-456-7890";
        String email = "test@restaurant.com";
        String imageUrl = "http://test.com/image.jpg";
        String managerId = "manager123";
        BigDecimal coordinatesLatitude = new BigDecimal("40.7128");
        BigDecimal coordinatesLongitude = new BigDecimal("-74.0060");
        List<String> cuisines = Arrays.asList("Italian", "Pizza");
        String cost = "$$";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalTime openingHour = LocalTime.of(9, 0);
        LocalTime closingHour = LocalTime.of(22, 0);
        Double averageRating = 4.5;
        Integer reviewCount = 10;
        boolean approved = true;

        // Act
        Restaurant restaurant = new Restaurant();
        restaurant.setId(id);
        restaurant.setName(name);
        restaurant.setDescription(description);
        restaurant.setAddressStreet(addressStreet);
        restaurant.setAddressCity(addressCity);
        restaurant.setAddressState(addressState);
        restaurant.setAddressZip(addressZip);
        restaurant.setPhone(phone);
        restaurant.setEmail(email);
        restaurant.setImageUrl(imageUrl);
        restaurant.setManagerId(managerId);
        restaurant.setCoordinatesLatitude(coordinatesLatitude);
        restaurant.setCoordinatesLongitude(coordinatesLongitude);
        restaurant.setCuisines(cuisines);
        restaurant.setCost(cost);
        restaurant.setCreatedAt(createdAt);
        restaurant.setOpeningHour(openingHour);
        restaurant.setClosingHour(closingHour);
        restaurant.setAverageRating(averageRating);
        restaurant.setReviewCount(reviewCount);
        restaurant.setApproved(approved);

        // Assert
        assertEquals(id, restaurant.getId());
        assertEquals(name, restaurant.getName());
        assertEquals(description, restaurant.getDescription());
        assertEquals(addressStreet, restaurant.getAddressStreet());
        assertEquals(addressCity, restaurant.getAddressCity());
        assertEquals(addressState, restaurant.getAddressState());
        assertEquals(addressZip, restaurant.getAddressZip());
        assertEquals(phone, restaurant.getPhone());
        assertEquals(email, restaurant.getEmail());
        assertEquals(imageUrl, restaurant.getImageUrl());
        assertEquals(managerId, restaurant.getManagerId());
        assertEquals(coordinatesLatitude, restaurant.getCoordinatesLatitude());
        assertEquals(coordinatesLongitude, restaurant.getCoordinatesLongitude());
        assertEquals(cuisines, restaurant.getCuisines());
        assertEquals(cost, restaurant.getCost());
        assertEquals(createdAt, restaurant.getCreatedAt());
        assertEquals(openingHour, restaurant.getOpeningHour());
        assertEquals(closingHour, restaurant.getClosingHour());
        assertEquals(averageRating, restaurant.getAverageRating());
        assertEquals(reviewCount, restaurant.getReviewCount());
        assertEquals(approved, restaurant.isApproved());
    }

    @Test
    void testRestaurantCreation_WithDefaultValues() {
        // Act
        Restaurant restaurant = new Restaurant();

        // Assert
        assertNull(restaurant.getId());
        assertNull(restaurant.getName());
        assertNull(restaurant.getDescription());
        assertNull(restaurant.getAddressStreet());
        assertNull(restaurant.getAddressCity());
        assertNull(restaurant.getAddressState());
        assertNull(restaurant.getAddressZip());
        assertNull(restaurant.getPhone());
        assertNull(restaurant.getEmail());
        assertNull(restaurant.getImageUrl());
        assertNull(restaurant.getManagerId());
        assertNull(restaurant.getCoordinatesLatitude());
        assertNull(restaurant.getCoordinatesLongitude());
        assertNull(restaurant.getCuisines());
        assertEquals("$", restaurant.getCost()); // Default value
        assertNull(restaurant.getCreatedAt());
        assertNull(restaurant.getOpeningHour());
        assertNull(restaurant.getClosingHour());
        assertEquals(0.0, restaurant.getAverageRating()); // Default value
        assertEquals(0, restaurant.getReviewCount()); // Default value
        assertFalse(restaurant.isApproved()); // Default value
    }

    @Test
    void testRestaurantCreation_WithEmptyFields() {
        // Arrange
        Restaurant restaurant = new Restaurant();
        restaurant.setName("");
        restaurant.setDescription("");
        restaurant.setAddressStreet("");
        restaurant.setAddressCity("");
        restaurant.setAddressState("");
        restaurant.setAddressZip("");
        restaurant.setPhone("");
        restaurant.setEmail("");
        restaurant.setImageUrl("");
        restaurant.setManagerId("");
        restaurant.setCuisines(List.of());
        restaurant.setCost("");

        // Assert
        assertEquals("", restaurant.getName());
        assertEquals("", restaurant.getDescription());
        assertEquals("", restaurant.getAddressStreet());
        assertEquals("", restaurant.getAddressCity());
        assertEquals("", restaurant.getAddressState());
        assertEquals("", restaurant.getAddressZip());
        assertEquals("", restaurant.getPhone());
        assertEquals("", restaurant.getEmail());
        assertEquals("", restaurant.getImageUrl());
        assertEquals("", restaurant.getManagerId());
        assertEquals(List.of(), restaurant.getCuisines());
        assertEquals("", restaurant.getCost());
    }
} 
package com.booktable.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RestaurantTableInputTest {

    @Test
    void testAllFields() {
        RestaurantTableInput input = new RestaurantTableInput();
        
        RestaurantInput restaurantInput = new RestaurantInput();
        restaurantInput.setName("Test Restaurant");
        restaurantInput.setDescription("A test restaurant");
        
        TableDetails tableDetails = new TableDetails();
        tableDetails.setCapacity(4);
        tableDetails.setCount(5);
        
        input.setRestaurantInput(restaurantInput);
        input.setTable(tableDetails);

        assertNotNull(input.getRestaurantInput());
        assertEquals("Test Restaurant", input.getRestaurantInput().getName());
        assertEquals("A test restaurant", input.getRestaurantInput().getDescription());
        
        assertNotNull(input.getTable());
        assertEquals(4, input.getTable().getCapacity());
        assertEquals(5, input.getTable().getCount());
    }

    @Test
    void testNullFields() {
        RestaurantTableInput input = new RestaurantTableInput();
        input.setRestaurantInput(null);
        input.setTable(null);

        assertNull(input.getRestaurantInput());
        assertNull(input.getTable());
    }
} 
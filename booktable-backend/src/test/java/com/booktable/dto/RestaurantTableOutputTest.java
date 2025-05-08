package com.booktable.dto;

import com.booktable.model.Restaurant;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

class RestaurantTableOutputTest {

    @Test
    void testAllFields() {
        RestaurantTableOutput output = new RestaurantTableOutput();
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Test Restaurant");
        
        TableSlots tableSlots1 = new TableSlots();
        tableSlots1.setTableId("1");
        
        TableSlots tableSlots2 = new TableSlots();
        tableSlots2.setTableId("2");
        
        List<TableSlots> tableSlotsList = Arrays.asList(tableSlots1, tableSlots2);
        
        output.setRestaurant(restaurant);
        output.setTableSlots(tableSlotsList);
        output.setNoOfTimesBookedToday(5);

        assertNotNull(output.getRestaurant());
        assertEquals("Test Restaurant", output.getRestaurant().getName());
        
        assertNotNull(output.getTableSlots());
        assertEquals(2, output.getTableSlots().size());
        assertEquals("1", output.getTableSlots().get(0).getTableId());
        assertEquals("2", output.getTableSlots().get(1).getTableId());
        
        assertEquals(5, output.getNoOfTimesBookedToday());
    }

    @Test
    void testNullFields() {
        RestaurantTableOutput output = new RestaurantTableOutput();
        output.setRestaurant(null);
        output.setTableSlots(null);
        output.setNoOfTimesBookedToday(null);

        assertNull(output.getRestaurant());
        assertNull(output.getTableSlots());
        assertNull(output.getNoOfTimesBookedToday());
    }
} 
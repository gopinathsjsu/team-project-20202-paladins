package com.booktable.service;

import com.booktable.dto.TableDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class RestaurantTableManager {

    @Autowired
    @Lazy
    private TableService tableService;

    public void deleteAndCreateTablesForRestaurant(String restaurantId, TableDetails tableDetails) {
        tableService.deleteTablesByRestaurantId(restaurantId);
        tableService.createTablesForRestaurant(restaurantId, tableDetails);
    }
}

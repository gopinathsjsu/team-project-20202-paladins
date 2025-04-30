package com.booktable.dto;

import com.booktable.model.Restaurant;
import lombok.Data;

@Data
public class RestaurantTableInput {
    private RestaurantInput restaurantInput;
    private TableDetails table;
}
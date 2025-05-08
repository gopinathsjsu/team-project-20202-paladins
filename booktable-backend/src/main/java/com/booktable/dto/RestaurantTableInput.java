package com.booktable.dto;

import lombok.Data;

@Data
public class RestaurantTableInput {
    private RestaurantInput restaurantInput;
    private TableDetails table;
}
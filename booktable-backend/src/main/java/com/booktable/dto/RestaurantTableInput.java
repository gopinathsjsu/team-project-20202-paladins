package com.booktable.dto;

import com.booktable.model.Restaurant;
import lombok.Data;

@Data
public class RestaurantTableInput {
    private Restaurant restaurant;
    private TableDetails table;
}
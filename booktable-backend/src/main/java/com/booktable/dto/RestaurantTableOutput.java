package com.booktable.dto;

import com.booktable.model.Restaurant;
import lombok.Data;

import java.util.List;

@Data
public class RestaurantTableOutput {
    private Restaurant restaurant;
    private List<TableSlots> tableSlots;
    private Integer noOfTimesBookedToday;
}
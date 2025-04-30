package com.booktable.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class RestaurantInput {
    private String name;
    private String description;

    private String addressStreet;
    private String addressCity;
    private String addressState;
    private String addressZip;

    private String phone;
    private String email;
    private String imageUrl;

    private BigDecimal coordinatesLatitude;
    private BigDecimal coordinatesLongitude;

    private List<String> cuisines;

    private LocalTime openingHour;
    private LocalTime closingHour;
}

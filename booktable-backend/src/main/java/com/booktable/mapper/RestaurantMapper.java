package com.booktable.mapper;

import com.booktable.dto.RestaurantInput;
import com.booktable.model.Restaurant;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RestaurantMapper {

    public Restaurant toEntity(RestaurantInput input, String managerId) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(input.getName());
        restaurant.setDescription(input.getDescription());
        restaurant.setAddressStreet(input.getAddressStreet());
        restaurant.setAddressCity(input.getAddressCity());
        restaurant.setAddressState(input.getAddressState());
        restaurant.setAddressZip(input.getAddressZip());
        restaurant.setPhone(input.getPhone());
        restaurant.setEmail(input.getEmail());
        restaurant.setImageUrl(input.getImageUrl());
        restaurant.setCoordinatesLatitude(input.getCoordinatesLatitude());
        restaurant.setCoordinatesLongitude(input.getCoordinatesLongitude());
        restaurant.setCuisines(input.getCuisines());
        restaurant.setOpeningHour(input.getOpeningHour());
        restaurant.setClosingHour(input.getClosingHour());

        restaurant.setManagerId(managerId);
        restaurant.setApproved(false); // always default to false

        return restaurant;
    }
}

package com.booktable.mapper;

import com.booktable.dto.RestaurantInput;
import com.booktable.model.Restaurant;
import org.springframework.stereotype.Component;

@Component
public class RestaurantUpdateMapper {

    // Maps RestaurantInput to an existing Restaurant entity (for update)
    public Restaurant updateEntity(RestaurantInput input, Restaurant existingRestaurant) {
        existingRestaurant.setName(input.getName());
        existingRestaurant.setDescription(input.getDescription());
        existingRestaurant.setAddressStreet(input.getAddressStreet());
        existingRestaurant.setAddressCity(input.getAddressCity());
        existingRestaurant.setAddressState(input.getAddressState());
        existingRestaurant.setAddressZip(input.getAddressZip());
        existingRestaurant.setPhone(input.getPhone());
        existingRestaurant.setEmail(input.getEmail());
        existingRestaurant.setImageUrl(input.getImageUrl());
        existingRestaurant.setCoordinatesLatitude(input.getCoordinatesLatitude());
        existingRestaurant.setCoordinatesLongitude(input.getCoordinatesLongitude());
        existingRestaurant.setCuisines(input.getCuisines());
        existingRestaurant.setOpeningHour(input.getOpeningHour());
        existingRestaurant.setClosingHour(input.getClosingHour());

        return existingRestaurant;
    }
}

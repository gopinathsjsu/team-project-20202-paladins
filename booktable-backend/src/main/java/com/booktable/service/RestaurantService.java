package com.booktable.service;

import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public Restaurant getRestaurantById(Object id) {
        return restaurantRepository.findById(String.valueOf(id)).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<Restaurant> searchRestaurants(String city, String state, String zip, String noOfPeople,
                                              LocalTime startTime) {
        return restaurantRepository.searchRestaurants(
                city != null ? city : "",
                state != null ? state : "",
                zip != null ? zip : "",
                noOfPeople != null ? Integer.parseInt(noOfPeople) : 0,
                LocalDate.now(),
                startTime

        );
    }

    public List<Restaurant> listRestaurants(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return restaurantRepository.findAll(pageable).getContent();
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, Restaurant updatedRestaurant) {
        Restaurant existingRestaurant = getRestaurantById(id);
        updatedRestaurant.setId(existingRestaurant.getId());
        return restaurantRepository.save(updatedRestaurant);
    }

    public Restaurant patchRestaurant(String id, Restaurant partialUpdate) {
        Restaurant existingRestaurant = getRestaurantById(id);
        if (partialUpdate.getName() != null) existingRestaurant.setName(partialUpdate.getName());
        if (partialUpdate.getDescription() != null) existingRestaurant.setDescription(partialUpdate.getDescription());
        // Add other fields as needed
        return restaurantRepository.save(existingRestaurant);
    }

    public void deleteRestaurant(String id) {
        restaurantRepository.deleteById(id);
    }



}
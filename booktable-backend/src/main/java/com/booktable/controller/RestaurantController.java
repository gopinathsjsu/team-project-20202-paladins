package com.booktable.controller;

import com.booktable.model.Restaurant;
import com.booktable.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/search")
    public List<Restaurant> searchRestaurants(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String zip) {
        return restaurantService.searchRestaurants(city, state, zip);
    }

    // Get a single restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return restaurantService.getRestaurantById(id);
    }

    // List all restaurants
    @GetMapping
    public List<Restaurant> listRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return restaurantService.listRestaurants(page, size);
    }
    // Create a new restaurant
    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.saveRestaurant(restaurant);
    }

    // Update an existing restaurant (full update)
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return restaurantService.updateRestaurant(id, restaurant);
    }

    // Partially update an existing restaurant
    @PatchMapping("/{id}")
    public Restaurant patchRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return restaurantService.patchRestaurant(id, restaurant);
    }

    // Delete a restaurant by ID
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
    }
}
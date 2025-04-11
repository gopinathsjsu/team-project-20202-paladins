package com.booktable.controller;

import com.booktable.model.RestaurantModel;

import javax.servlet.http.HttpServletResponse;

import com.booktable.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RestaurantController {
    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/api/restaurant")
    public String sayHello() {
        return "Hello from BookTable!";
    }

    @PostMapping("/api/restaurant")
    public RestaurantModel addRestaurant(@RequestBody RestaurantModel restaurantModel) {
         return restaurantService.saveRestaurant(restaurantModel);

    }
}
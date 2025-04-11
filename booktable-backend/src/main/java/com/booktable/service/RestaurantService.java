package com.booktable.service;

import com.booktable.model.RestaurantModel;
import com.booktable.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;
    private RestaurantModel resurantModel;


    public RestaurantModel saveRestaurant(RestaurantModel restaurant) {
        return restaurantRepository.save(restaurant);
    }
}
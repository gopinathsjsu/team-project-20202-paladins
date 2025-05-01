package com.booktable.repository;

import com.booktable.model.Restaurant;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CustomRestaurantRepository {
    List<Restaurant> searchRestaurants(String city, String state, String zip, int numberOfPeople, LocalDate date, LocalTime startTime);
}
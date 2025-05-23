package com.booktable.repository;

import com.booktable.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String>, CustomRestaurantRepository {
    List<Restaurant> findByApprovedFalse();
    List<Restaurant> findByManagerId(String managerId);
    List<Restaurant> findByManagerIdAndApprovedTrue(String managerId);
    Page<Restaurant> findAllByApprovedTrue(Pageable pageable);
    List<Restaurant> searchRestaurants(String city, String state, String zip,
                                       int noOfPeople, LocalDate date, LocalTime startTime, String name);
}
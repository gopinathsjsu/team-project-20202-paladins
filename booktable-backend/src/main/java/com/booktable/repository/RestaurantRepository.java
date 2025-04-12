package com.booktable.repository;

import com.booktable.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    @Query("{ $and: [ " +
            "{ 'addressCity': { $regex: ?0, $options: 'i' } }, " +
            "{ 'addressState': { $regex: ?1, $options: 'i' } }, " +
            "{ 'addressZip': { $regex: ?2, $options: 'i' } } " +
            "] }")
    List<Restaurant> searchRestaurants(String city, String state, String zip);
}
package com.booktable.repository;

import com.booktable.model.Restaurant;
import com.booktable.repository.CustomRestaurantRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String>, CustomRestaurantRepository {
}
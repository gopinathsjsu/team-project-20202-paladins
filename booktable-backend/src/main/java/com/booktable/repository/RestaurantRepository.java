package com.booktable.repository;

import com.booktable.model.Restaurant;
import com.booktable.repository.CustomRestaurantRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String>, CustomRestaurantRepository {
    List<Restaurant> findByApprovedFalse();
    List<Restaurant> findByManagerId(String managerId);
}
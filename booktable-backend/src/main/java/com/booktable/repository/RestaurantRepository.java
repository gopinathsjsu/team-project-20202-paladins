package com.booktable.repository;

import com.booktable.model.RestaurantModel;
import com.booktable.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends MongoRepository<RestaurantModel, String> {
    // Add custom query methods if needed
    RestaurantModel findById(ObjectId id);
}
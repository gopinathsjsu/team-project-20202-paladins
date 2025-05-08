package com.booktable.repository;

import com.booktable.model.Table;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TableRepository extends MongoRepository<Table, String> {
    List<Table> findByRestaurantId(ObjectId restaurantId);

    void deleteByRestaurantId(ObjectId restaurantId);
}

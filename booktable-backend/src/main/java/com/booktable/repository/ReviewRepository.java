package com.booktable.repository;

import com.booktable.dto.RatingStats;
import com.booktable.model.Review;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
    @NotNull Optional<Review> findById(@NotNull ObjectId id);

    Optional<Review> findByIdAndCustomerId(ObjectId id, ObjectId customerId);

    void deleteById(@NotNull ObjectId id);

    Page<Review> findByRestaurantId(ObjectId restaurantId, Pageable pageable);

    boolean existsById(@NotNull ObjectId objectId);

    // A pipeline to get the average rating and count of reviews for a specific restaurant
    @Aggregation(pipeline = {
            "{ $match: { restaurantId: ?0 } }",
            "{ $group: { _id: '$restaurantId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }",
            "{ $project: { id: '$_id', averageRating: '$avgRating', count: '$count', _id: 0 } }"
    })
    Optional<RatingStats> getRatingStats(ObjectId restaurantId);
}

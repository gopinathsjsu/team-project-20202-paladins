package com.booktable.service;

import com.booktable.dto.RatingStats;
import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.ReviewRepository;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, ReviewRepository reviewRepository) {
        this.restaurantRepository = restaurantRepository;
        this.reviewRepository = reviewRepository;
    }

    public Restaurant getRestaurantById(Object id) {
        return restaurantRepository.findById(String.valueOf(id)).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<Restaurant> searchRestaurants(String city, String state, String zip, String noOfPeople,
                                              LocalTime startTime) {
        return restaurantRepository.searchRestaurants(
                city != null ? city : "",
                state != null ? state : "",
                zip != null ? zip : "",
                noOfPeople != null ? Integer.parseInt(noOfPeople) : 0,
                LocalDate.now(),
                startTime

        );
    }

    public List<Restaurant> listRestaurants(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return restaurantRepository.findAll(pageable).getContent();
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, Restaurant updatedRestaurant) {
        Restaurant existingRestaurant = getRestaurantById(id);
        updatedRestaurant.setId(existingRestaurant.getId());
        return restaurantRepository.save(updatedRestaurant);
    }

    public Restaurant patchRestaurant(String id, Restaurant partialUpdate) {
        Restaurant existingRestaurant = getRestaurantById(id);
        if (partialUpdate.getName() != null) existingRestaurant.setName(partialUpdate.getName());
        if (partialUpdate.getDescription() != null) existingRestaurant.setDescription(partialUpdate.getDescription());
        return restaurantRepository.save(existingRestaurant);
    }

    public void deleteRestaurant(String id) {
        restaurantRepository.deleteById(id);
    }

    @Async
    @Transactional
    public void updateRestaurantRatingStatsAsync(ObjectId restaurantId) {
        try {
            Optional<RatingStats> statsOpt = reviewRepository.getRatingStats(restaurantId);
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantId.toHexString());

            if (restaurantOpt.isPresent()) {
                Restaurant restaurant = getRestaurant(restaurantOpt, statsOpt);

                restaurantRepository.save(restaurant);
            }
        } catch (Exception e) {
            System.err.println("Error updating restaurant rating stats: " + e.getMessage());
        }
    }

    @NotNull
    private static Restaurant getRestaurant(Optional<Restaurant> restaurantOpt, Optional<RatingStats> statsOpt) {
        Restaurant restaurant = restaurantOpt.get();

        if (statsOpt.isPresent()) {
            RatingStats stats = statsOpt.get();
            restaurant.setAverageRating(stats.getAverageRating());
            restaurant.setReviewCount(stats.getCount());
        } else {
            // No reviews found, reset stats
            restaurant.setAverageRating(0.0);
            restaurant.setReviewCount(0);
        }
        return restaurant;
    }
}
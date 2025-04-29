package com.booktable.service;

import com.booktable.dto.RatingStats;
import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.ReviewRepository;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger log = LoggerFactory.getLogger(RestaurantService.class);

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, ReviewRepository reviewRepository) {
        this.restaurantRepository = restaurantRepository;
        this.reviewRepository = reviewRepository;
    }

    public Restaurant getRestaurantById(Object id) {
        log.info("Fetching restaurant with ID: {}", id);
        return restaurantRepository.findById(String.valueOf(id)).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<Restaurant> searchRestaurants(String city, String state, String zip, String noOfPeople,
                                              LocalTime startTime, LocalTime endTime) {
        log.info("Searching restaurants with params: city={}, state={}, zip={}, noOfPeople={}, startTime={}, endTime={}",
                city, state, zip, noOfPeople, startTime, endTime);
        return restaurantRepository.searchRestaurants(
                city != null ? city : "",
                state != null ? state : "",
                zip != null ? zip : "",
                noOfPeople != null ? Integer.parseInt(noOfPeople) : 0,
                LocalDate.now(),
                startTime,
                endTime
        );
    }

    public List<Restaurant> listRestaurants(int page, int size) {
        log.info("Listing restaurants with pagination: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        return restaurantRepository.findAll(pageable).getContent();
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        log.info("Saving restaurant: {}", restaurant);
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, Restaurant updatedRestaurant) {
        log.info("Updating restaurant with ID: {}", id);
        Restaurant existingRestaurant = getRestaurantById(id);
        updatedRestaurant.setId(existingRestaurant.getId());
        return restaurantRepository.save(updatedRestaurant);
    }

    public Restaurant patchRestaurant(String id, Restaurant partialUpdate) {
        log.info("Partially updating restaurant with ID: {}", id);
        Restaurant existingRestaurant = getRestaurantById(id);
        if (partialUpdate.getName() != null) existingRestaurant.setName(partialUpdate.getName());
        if (partialUpdate.getDescription() != null) existingRestaurant.setDescription(partialUpdate.getDescription());
        return restaurantRepository.save(existingRestaurant);
    }

    public void deleteRestaurant(String id) {
        log.info("Deleting restaurant with ID: {}", id);
        restaurantRepository.deleteById(id);
    }

    @Async
    @Transactional
    public void updateRestaurantRatingStatsAsync(ObjectId restaurantId) {
        log.info("Updating restaurant rating stats asynchronously for restaurant ID: {}", restaurantId);
        try {
            Optional<RatingStats> statsOpt = reviewRepository.getRatingStats(restaurantId);
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(restaurantId.toHexString());

            if (restaurantOpt.isPresent()) {
                log.info("Updating restaurant rating stats for restaurant ID: {}", restaurantId);
                Restaurant restaurant = getRestaurant(restaurantOpt, statsOpt);

                restaurantRepository.save(restaurant);
            } else {
                log.warn("Restaurant not found for ID: {}", restaurantId);
            }
        } catch (Exception e) {
            log.error("Error updating restaurant rating stats for restaurant ID: {}", restaurantId, e);
            log.error("Stacktrace: {}", (Object) e.getStackTrace());
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
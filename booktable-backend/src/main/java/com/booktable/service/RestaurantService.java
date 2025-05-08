package com.booktable.service;

import com.booktable.dto.RatingStats;
import com.booktable.dto.RestaurantInput;
import com.booktable.dto.RestaurantTableInput;
import com.booktable.dto.TableDetails;
import com.booktable.mapper.RestaurantUpdateMapper;
import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.ReviewRepository;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantUpdateMapper restaurantUpdateMapper;
    private final RestaurantTableManager restaurantTableManager;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository,
                             ReviewRepository reviewRepository,
                             RestaurantUpdateMapper restaurantUpdateMapper,
                             RestaurantTableManager restaurantTableManager) {
        this.restaurantRepository = restaurantRepository;
        this.reviewRepository = reviewRepository;
        this.restaurantUpdateMapper = restaurantUpdateMapper;
        this.restaurantTableManager = restaurantTableManager;
    }

    // Get restaurants by managerId
    public List<Restaurant> getRestaurantsByManagerId(String managerId) {
        return restaurantRepository.findByManagerIdAndApprovedTrue(managerId);
    }

    public Restaurant getRestaurantById(Object id) {
        Restaurant restaurant = restaurantRepository.findById(String.valueOf(id)).orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return restaurant;
    }

    public List<Restaurant> searchRestaurants(String name, String city, String state, String zip, String noOfPeople,
                                          LocalTime startTime, LocalDate date) {
        List<Restaurant> results = restaurantRepository.searchRestaurants(
                        city != null ? city : "",
                        state != null ? state : "",
                        zip != null ? zip : "",
                        noOfPeople != null ? Integer.parseInt(noOfPeople) : 0,
                        date != null ? date : LocalDate.now(),
                        startTime,
                        name != null ? name : ""
                );

        return results.stream()
                .filter(restaurant ->
                        restaurant.getOpeningHour().isBefore(startTime.plusMinutes(1)) &&
                                restaurant.getClosingHour().isAfter(startTime))
                .collect(Collectors.toList());
    }

    public List<Restaurant> listRestaurants(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurantPage = restaurantRepository.findAllByApprovedTrue(pageable);
        return restaurantPage.getContent();
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, RestaurantTableInput updatedRestaurantTableInput) {
        RestaurantInput inputRestaurant = updatedRestaurantTableInput.getRestaurantInput();
        TableDetails tableDetails = updatedRestaurantTableInput.getTable();

        Restaurant existingRestaurant = getRestaurantById(new ObjectId(id));

        Restaurant updatedRestaurant = restaurantUpdateMapper.updateEntity(inputRestaurant, existingRestaurant);

        restaurantTableManager.deleteAndCreateTablesForRestaurant(id, tableDetails);

        return restaurantRepository.save(updatedRestaurant);
    }

    public Restaurant patchRestaurant(String id, Restaurant partialUpdate) {
        Restaurant existingRestaurant = getRestaurantById(id);
        if (partialUpdate.getName() != null) existingRestaurant.setName(partialUpdate.getName());
        if (partialUpdate.getDescription() != null) existingRestaurant.setDescription(partialUpdate.getDescription());
        return restaurantRepository.save(existingRestaurant);
    }

    public boolean deleteRestaurant(String id) {
        if (restaurantRepository.existsById(id)) {
            restaurantRepository.deleteById(id);
            return true;
        }
        return false;
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

    @Transactional
    public Restaurant setRestaurantApprovalStatus(String restaurantId, boolean isApproved) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + restaurantId));
        restaurant.setApproved(isApproved);
        return restaurantRepository.save(restaurant);
    }
}
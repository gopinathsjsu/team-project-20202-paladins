package com.booktable.service;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.model.Review;
import com.booktable.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);
    private final ReviewRepository reviewRepository;
    private final RestaurantService restaurantService;

    @Transactional
    public Review createReview(CreateReviewRequest request, ObjectId customerId) {
        log.info("Creating review for restaurant ID: {}, customer ID: {}", request.getRestaurantId(), customerId);

        Review review = Review.builder()
                .restaurantId(request.getRestaurantId())
                .customerId(customerId)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        restaurantService.updateRestaurantRatingStatsAsync(savedReview.getRestaurantId());

        return savedReview;
    }

    @Transactional
    public Optional<Review> updateReview(ObjectId reviewId, CreateReviewRequest request, ObjectId customerId) {
        log.info("Updating review with ID: {} for customer ID: {}", reviewId, customerId);
        Optional<Review> existingReviewOpt = reviewRepository.findByIdAndCustomerId(reviewId, customerId);

        if (existingReviewOpt.isPresent()) {
            log.info("Review found, proceeding to update: {}", existingReviewOpt.get());
            Review existingReview = existingReviewOpt.get();

            existingReview.setRating(request.getRating());
            existingReview.setComment(request.getComment());

            Review updatedReview = reviewRepository.save(existingReview);

            restaurantService.updateRestaurantRatingStatsAsync(updatedReview.getRestaurantId());

            return Optional.of(updatedReview);
        }
        return Optional.empty(); // Review not found
    }

    @Transactional
    public boolean deleteReview(ObjectId reviewId) {
        log.info("Deleting review with ID: {}", reviewId);
        Optional<Review> review = reviewRepository.findById(reviewId);

        if (review.isPresent()) {
            log.info("Review found, proceeding to delete: {}", review.get());
            ObjectId restaurantId = review.get().getRestaurantId();
            reviewRepository.deleteById(reviewId);
            restaurantService.updateRestaurantRatingStatsAsync(restaurantId);

            return true;
        }
        return false;
    }

    public Page<Review> getReviewsForRestaurant(ObjectId restaurantId, Pageable pageable) {
        log.info("Fetching reviews for restaurant ID: {}", restaurantId);
        return reviewRepository.findByRestaurantId(restaurantId, pageable);
    }
}
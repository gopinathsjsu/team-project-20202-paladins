package com.booktable.service;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.model.Review;
import com.booktable.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantService restaurantService;

    @Transactional
    public Review createReview(CreateReviewRequest request, ObjectId customerId) {
        Review review = new Review();
        review.setRestaurantId(request.getRestaurantId());
        review.setCustomerId(customerId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        restaurantService.updateRestaurantRatingStatsAsync(savedReview.getRestaurantId());

        return savedReview;
    }

    @Transactional
    public Optional<Review> updateReview(ObjectId reviewId, CreateReviewRequest request, ObjectId customerId) {
        Optional<Review> existingReviewOpt = reviewRepository.findByIdAndCustomerId(reviewId, customerId);

        if (existingReviewOpt.isPresent()) {
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

        Optional<Review> review = reviewRepository.findById(reviewId);

        if (review.isPresent()) {
            ObjectId restaurantId = review.get().getRestaurantId();
            reviewRepository.deleteById(reviewId);
            restaurantService.updateRestaurantRatingStatsAsync(restaurantId);

            return true;
        }
        return false;
    }

    public Page<Review> getReviewsForRestaurant(ObjectId restaurantId, Pageable pageable) {
        return reviewRepository.findByRestaurantId(restaurantId, pageable);
    }
}
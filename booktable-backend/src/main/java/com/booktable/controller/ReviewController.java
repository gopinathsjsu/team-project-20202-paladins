package com.booktable.controller;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.dto.ReviewsByRestaurantRequest;
import com.booktable.model.Review;
import com.booktable.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// TODO: Once Auth is enabled, uncomment the following imports
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    @PostMapping
//    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> createReview(@Valid @RequestBody CreateReviewRequest request) {
        log.info("Received request to create review: {}", request);
//        ObjectId customerId = new ObjectId(currentUser.getId());
        try {
            Review createdReview = reviewService.createReview(request, request.getCustomerId()); // TODO: Once Auth is enabled, use customerId
            log.info("Successfully created review with ID: {}", createdReview.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            log.error("Error creating review for request: {}", request, e);
            // Consider returning a more specific error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{reviewId}")
//    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> updateReview(@PathVariable String reviewId,
                                               @Valid @RequestBody CreateReviewRequest request) {
        log.info("Received request to update review ID {}: {}", reviewId, request);
//        ObjectId customerId = new ObjectId(currentUser.getId());
        ObjectId reviewObjectId = new ObjectId(reviewId);
        try {
            return reviewService.updateReview(reviewObjectId, request, request.getCustomerId()) // TODO: Once Auth is enabled, use customerId
                    .map(updatedReview -> {
                        log.info("Successfully updated review ID: {}", reviewId);
                        return ResponseEntity.ok(updatedReview);
                    })
                    .orElseGet(() -> {
                        log.warn("Review not found for update with ID: {}", reviewId);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            log.error("Error updating review ID {}: {}", reviewId, request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{reviewId}")
//    @PreAuthorize("hasAuthority('CUSTOMER')") // Only customers can delete
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        log.info("Received request to delete review ID: {}", reviewId);
//        ObjectId customerId = new ObjectId(currentUser.getId());
        ObjectId reviewObjectId = new ObjectId(reviewId);
        try {
            boolean deleted = reviewService.deleteReview(reviewObjectId);
            if (deleted) {
                log.info("Successfully deleted review ID: {}", reviewId);
                return ResponseEntity.noContent().build();
            } else {
                log.warn("Review not found for deletion with ID: {}", reviewId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("{}: Error deleting review ID {}", e, reviewId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Page<Review>> getReviewsByRestaurant(
            @PathVariable String restaurantId,
            @Valid ReviewsByRestaurantRequest request) {
        log.info("Received request to get reviews for restaurant ID {} with params: {}", restaurantId, request);
        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(request.getDirection(), request.getSortProperty())
        );

        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        try {
            Page<Review> reviewPage = reviewService.getReviewsForRestaurant(restaurantObjectId, pageable);
            log.info("Successfully retrieved {} reviews for restaurant ID {}", reviewPage.getTotalElements(), restaurantId);
            return ResponseEntity.ok(reviewPage);
        } catch (Exception e) {
            log.error("Error retrieving reviews for restaurant ID {}: {}", restaurantId, request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

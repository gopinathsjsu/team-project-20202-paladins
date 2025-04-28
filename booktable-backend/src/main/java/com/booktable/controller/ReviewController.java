package com.booktable.controller;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.dto.ReviewsByRestaurantRequest;
import com.booktable.model.Review;
import com.booktable.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
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

    @PostMapping
//    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> createReview(@Valid @RequestBody CreateReviewRequest request) {

//        ObjectId customerId = new ObjectId(currentUser.getId());
        Review createdReview = reviewService.createReview(request, request.getCustomerId()); // TODO: Once Auth is enabled, use customerId
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @PutMapping("/{reviewId}")
//    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> updateReview(@PathVariable String reviewId,
                                               @Valid @RequestBody CreateReviewRequest request) {
//        ObjectId customerId = new ObjectId(currentUser.getId());
        System.out.println("ReviewController.updateReview: " + request.getCustomerId());
        ObjectId reviewObjectId = new ObjectId(reviewId);
        return reviewService.updateReview(reviewObjectId, request, request.getCustomerId()) // TODO: Once Auth is enabled, use customerId
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{reviewId}")
//    @PreAuthorize("hasAuthority('CUSTOMER')") // Only customers can delete
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
//        ObjectId customerId = new ObjectId(currentUser.getId());
        ObjectId reviewObjectId = new ObjectId(reviewId);
        boolean deleted = reviewService.deleteReview(reviewObjectId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Page<Review>> getReviewsByRestaurant(
            @PathVariable String restaurantId,
            @Valid ReviewsByRestaurantRequest request) {

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(request.getDirection(), request.getSortProperty())
        );

        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        Page<Review> reviewPage = reviewService.getReviewsForRestaurant(restaurantObjectId, pageable);
        return ResponseEntity.ok(reviewPage);
    }

}

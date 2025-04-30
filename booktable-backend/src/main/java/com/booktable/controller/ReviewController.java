package com.booktable.controller;

import com.booktable.dto.CreateReviewRequest;
import com.booktable.dto.ReviewsByRestaurantRequest;
import com.booktable.model.Review;
    import com.booktable.model.User;
import com.booktable.service.ReviewService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> createReview(@Valid @RequestBody CreateReviewRequest request,
                                               @AuthenticationPrincipal User currentUser) {

        ObjectId customerId = new ObjectId(currentUser.getId());
        Review createdReview = reviewService.createReview(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Review> updateReview(@PathVariable String reviewId,
                                               @Valid @RequestBody CreateReviewRequest request,
                                               @AuthenticationPrincipal User currentUser) {
        ObjectId customerId = new ObjectId(currentUser.getId());
        ObjectId reviewObjectId = new ObjectId(reviewId);
        return reviewService.updateReview(reviewObjectId, request, customerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId,
                                             @AuthenticationPrincipal User currentUser) {
        ObjectId customerId = new ObjectId(currentUser.getId());
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

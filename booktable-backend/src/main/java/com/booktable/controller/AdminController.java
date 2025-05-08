package com.booktable.controller;

import com.booktable.model.Restaurant;
import com.booktable.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public String viewAdminDashboard() {
        return "Welcome to the Admin Dashboard";
    }

    @GetMapping("/pending-restaurants")
    public ResponseEntity<List<Restaurant>> getPendingRestaurants() {
        return ResponseEntity.ok(adminService.getPendingRestaurants());
    }

    @PatchMapping("/approve/{restaurantId}")
    public ResponseEntity<String> approveRestaurant(@PathVariable String restaurantId) {
        boolean success = adminService.approveRestaurant(restaurantId);
        return success
                ? ResponseEntity.ok("Restaurant approved successfully")
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
    }

}

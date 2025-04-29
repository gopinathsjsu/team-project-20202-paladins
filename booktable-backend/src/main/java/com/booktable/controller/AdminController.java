package com.booktable.controller;

import com.booktable.dto.RestaurantTableOutput;
import com.booktable.model.Restaurant;
import com.booktable.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public String viewAdminDashboard() {
        return "Welcome to the Admin Dashboard";
    }

    @GetMapping("/pending-restaurants")
    public ResponseEntity<List<Restaurant>> getPendingRestaurants() {
        log.info("Fetching pending restaurant registrations");
        return ResponseEntity.ok(adminService.getPendingRestaurants());
    }
}

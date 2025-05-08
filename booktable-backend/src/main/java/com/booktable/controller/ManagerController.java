package com.booktable.controller;

import com.booktable.model.Restaurant;
import com.booktable.model.User;
import com.booktable.service.RestaurantService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @Autowired
    private RestaurantService restaurantService;

    // Get the list of restaurants owned by the logged-in manager
    @GetMapping("/listings")
    public List<Restaurant> viewManagerListings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return restaurantService.getRestaurantsByManagerId(currentUser.getId());
    }
}

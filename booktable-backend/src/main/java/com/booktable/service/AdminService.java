package com.booktable.service;

import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getPendingRestaurants() {
        return restaurantRepository.findByApprovedFalse();
    }
}

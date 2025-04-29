package com.booktable.service;

import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getPendingRestaurants() {
        log.info("Fetching pending restaurant registrations");
        return restaurantRepository.findByApprovedFalse();
    }
}

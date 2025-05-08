package com.booktable.service;

import com.booktable.mapper.RestaurantUpdateMapper;
import com.booktable.model.Restaurant;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RestaurantUpdateMapper restaurantUpdateMapper;

    @Mock
    private RestaurantTableManager restaurantTableManager;

    @InjectMocks
    private RestaurantService restaurantService;

    @Test
    void getRestaurantsByManagerId_returnsApprovedRestaurants() {
        String managerId = "manager123";
        List<Restaurant> mockRestaurants = List.of(new Restaurant(), new Restaurant());
        when(restaurantRepository.findByManagerIdAndApprovedTrue(managerId)).thenReturn(mockRestaurants);

        List<Restaurant> result = restaurantService.getRestaurantsByManagerId(managerId);

        assertEquals(mockRestaurants, result);
        verify(restaurantRepository).findByManagerIdAndApprovedTrue(managerId);
    }

    @Test
    void getRestaurantById_throwsExceptionWhenNotFound() {
        String restaurantId = "nonexistentId";
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> restaurantService.getRestaurantById(restaurantId));
    }

    @Test
    void searchRestaurants_filtersByOpeningAndClosingHours() {
        LocalTime startTime = LocalTime.of(12, 0);
        LocalDate date = LocalDate.now();
        Restaurant restaurant1 = new Restaurant();
        restaurant1.setOpeningHour(LocalTime.of(11, 0));
        restaurant1.setClosingHour(LocalTime.of(14, 0));
        Restaurant restaurant2 = new Restaurant();
        restaurant2.setOpeningHour(LocalTime.of(15, 0));
        restaurant2.setClosingHour(LocalTime.of(20, 0));
        List<Restaurant> mockResults = List.of(restaurant1, restaurant2);

        when(restaurantRepository.searchRestaurants(anyString(), anyString(), anyString(), anyInt(), eq(date), eq(startTime), anyString()))
                .thenReturn(mockResults);

        List<Restaurant> result = restaurantService.searchRestaurants(null, null, null, null, "4", startTime, date);

        assertEquals(1, result.size());
        assertTrue(result.contains(restaurant1));
        assertFalse(result.contains(restaurant2));
    }

    @Test
    void deleteRestaurant_returnsFalseWhenRestaurantDoesNotExist() {
        String restaurantId = "nonexistentId";
        when(restaurantRepository.existsById(restaurantId)).thenReturn(false);

        boolean result = restaurantService.deleteRestaurant(restaurantId);

        assertFalse(result);
        verify(restaurantRepository, never()).deleteById(anyString());
    }

    @Test
    void setRestaurantApprovalStatus_updatesApprovalStatus() {
        String restaurantId = "restaurant123";
        Restaurant mockRestaurant = new Restaurant();
        mockRestaurant.setApproved(false);
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(mockRestaurant));
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(mockRestaurant);

        Restaurant result = restaurantService.setRestaurantApprovalStatus(restaurantId, true);

        assertTrue(result.isApproved());
        verify(restaurantRepository).save(mockRestaurant);
    }
}
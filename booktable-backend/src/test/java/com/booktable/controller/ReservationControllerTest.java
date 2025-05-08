package com.booktable.controller;

import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.model.User;
import com.booktable.service.ReservationService;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ReservationControllerTest {

    @Mock
    private ReservationService reservationService;

    @Mock
    private TableService tableService;

    @Mock
    private RestaurantService restaurantService;

    @InjectMocks
    private ReservationController reservationController;

    @Mock
    private User mockUser;

    @Mock
    private Reservation mockReservation;

    @Mock
    private Table mockTable;

    @Mock
    private Restaurant mockRestaurant;


    @Test
    void cancelMyReservation_returnsBadRequestWhenInvalidReservationId() {
        ResponseEntity<Void> response = reservationController.cancelMyReservation("invalidId", mockUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
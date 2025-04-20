package com.booktable.controller;

import com.booktable.dto.BookingDto;
import com.booktable.dto.RestaurantTableInput;
import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.service.ReservationService;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/book")
public class ReservationController {
    private final ReservationService reservationService;
    private final TableService tableService;
    private final RestaurantService restaurantService;


    @Autowired
    public ReservationController(ReservationService reservationService, TableService tableService, RestaurantService restaurantService) {

        this.reservationService = reservationService;
        this.tableService = tableService;
        this.restaurantService = restaurantService;
    }

    @PostMapping
    public BookingDto addReservation(@RequestBody Reservation reservation) {
        // add validations
        // TODO PUSH THIS ERROR OUT TO FRONTEND

        // Check for duplicate reservation
        boolean isDuplicate = reservationService.isDuplicateReservation(reservation);
        if (isDuplicate) {
            throw new IllegalArgumentException("Duplicate reservation: This reservation already exists.");
        }



        // Fetch related entities
        Table table = tableService.getTableById(reservation.getTableId());
        if (table == null) {
            throw new IllegalArgumentException("Table not found for ID: " + reservation.getTableId());
        }

        Restaurant restaurant = restaurantService.getRestaurantById(reservation.getRestaurantId());
        if (restaurant == null) {
            throw new IllegalArgumentException("Restaurant not found for ID: " + reservation.getRestaurantId());
        }

        // Save the reservation using the service
        Reservation savedReservation = reservationService.saveReservation(reservation);

        // Map the saved reservation to a BookingDto
        BookingDto bookingDto = new BookingDto(
                savedReservation.getRestaurantId(),
                savedReservation.getTableId(),
                savedReservation.getStartSlotTime(),
                savedReservation.getEndSlotTime(),
                savedReservation.getDate()
        );
        bookingDto.setReservationId(savedReservation.getId());
        bookingDto.setTableNumber(table.getTableNumber());
        bookingDto.setRestaurantName(restaurant.getName());

        return bookingDto;



    }
}





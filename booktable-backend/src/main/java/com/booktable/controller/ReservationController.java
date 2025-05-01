package com.booktable.controller;

import com.booktable.dto.BookingDto;
import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.model.User;
import com.booktable.service.ReservationService;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@SecurityRequirement(name = "bearerAuth")
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
    public BookingDto addReservation(@RequestBody Reservation request,
                                     @AuthenticationPrincipal User currentUser) {
        // add validations
        // TODO PUSH THIS ERROR OUT TO FRONTEND

        Reservation reservation = Reservation.builder()
                .customerId(new ObjectId(currentUser.getId()))
                .restaurantId(request.getRestaurantId())
                .tableId(request.getTableId())
                .date(request.getDate())
                .startSlotTime(request.getStartSlotTime())
                .endSlotTime(request.getEndSlotTime())
                .partySize(request.getPartySize())
                .build();

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

    @GetMapping
    public List<BookingDto> getReservations(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "restaurantId", required = false) String restaurantId) {

        List<Reservation> reservations = reservationService.getReservations(date, startDate, endDate, restaurantId);
        List<BookingDto> bookingDtos = new ArrayList<>();

        for (Reservation res : reservations) {
            Table table = tableService.getTableById(res.getTableId());
            Restaurant restaurant = restaurantService.getRestaurantById(res.getRestaurantId());

            BookingDto dto = new BookingDto(
                    res.getRestaurantId(),
                    res.getTableId(),
                    res.getStartSlotTime(),
                    res.getEndSlotTime(),
                    res.getDate()
            );
            dto.setReservationId(res.getId());
            if (table != null) dto.setTableNumber(table.getTableNumber());
            if (restaurant != null) dto.setRestaurantName(restaurant.getName());

            bookingDtos.add(dto);
        }

        return bookingDtos;
    }


}








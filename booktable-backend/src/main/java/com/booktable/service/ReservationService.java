package com.booktable.service;

import com.booktable.repository.ReservationRepository;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.TableRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.booktable.model.Reservation;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);

    private final ReservationRepository reservationRepository;


    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation saveReservation(Reservation reservation) {
        log.info("Saving reservation: {}", reservation);
        return reservationRepository.save(reservation);
    }

    public boolean isDuplicateReservation(Reservation reservation) {
        log.info("Checking for duplicate reservation: {}", reservation);
        List<Reservation> existingReservations = reservationRepository.findByRestaurantIdAndTableIdAndDateAndStartSlotTimeAndEndSlotTime(
                reservation.getRestaurantId(),
                reservation.getTableId(),
                reservation.getDate(),
                reservation.getStartSlotTime(),
                reservation.getEndSlotTime()
        );
        return !existingReservations.isEmpty();
    }

    public Set<List<Object>> getBookedTablesAndTimes(ObjectId restaurantId, LocalDate date) {
        log.info("Fetching booked tables and times for restaurant ID: {} on date: {}", restaurantId, date);
        return reservationRepository.findBookedTablesAndTimes(restaurantId, date).stream()
                .map(record -> List.of(
                        String.valueOf(record[0]), // tableId
                        List.of(record[1], record[2])) // (startTime, endTime)
                )
                .collect(Collectors.toSet());
    }
}
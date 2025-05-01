package com.booktable.service;

import com.booktable.model.Reservation;
import com.booktable.repository.ReservationRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;


    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation saveReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public boolean isDuplicateReservation(Reservation reservation) {
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
        return reservationRepository.findBookedTablesAndTimes(restaurantId, date).stream()
                .map(record -> List.of(
                        String.valueOf(record[0]), // tableId
                        List.of(record[1], record[2])) // (startTime, endTime)
                )
                .collect(Collectors.toSet());
    }

    public int countReservationsForDate(ObjectId restaurantId, LocalDate date) {
        return (int) reservationRepository.countByRestaurantIdAndDate(restaurantId, date);
    }

    public List<Reservation> getReservations(LocalDate date, LocalDate startDate, LocalDate endDate, String restaurantId) {
        if (date != null && restaurantId != null) {
            return reservationRepository.findByDateAndRestaurantId(date, restaurantId);
        } else if (startDate != null && endDate != null && restaurantId != null) {
            return reservationRepository.findByDateBetweenAndRestaurantId(startDate, endDate, restaurantId);
        } else if (startDate != null && endDate != null) {
            return reservationRepository.findByDateBetween(startDate, endDate);
        } else if (date != null) {
            return reservationRepository.findByDate(date);
        } else if (restaurantId != null) {
            return reservationRepository.findByRestaurantId(new ObjectId(restaurantId));
        } else {
            return reservationRepository.findAll();
        }
    }


}
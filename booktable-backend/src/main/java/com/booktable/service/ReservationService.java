package com.booktable.service;

import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.repository.ReservationRepository;
import com.booktable.repository.RestaurantRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, RestaurantRepository restaurantRepository) {
        this.reservationRepository = reservationRepository;
        this.restaurantRepository = restaurantRepository;
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
                .map(record -> {
                    System.out.println("Record: " + record);
                    return List.of(
                            String.valueOf(record.getTableId()), // Assuming `record` has a `getTableId()` method
                            List.of(record.getStartSlotTime(), record.getEndSlotTime()) // Assuming `record` has `getStartTime()` and `getEndTime()` methods
                    );
                })
                .collect(Collectors.toSet());
    }

    public int countReservationsForDate(ObjectId restaurantId, LocalDate date) {
        Long count = reservationRepository.countByRestaurantIdAndDate(restaurantId, date);
        return count != null ? count.intValue() : 0;
    }

    public List<Reservation> getReservations(LocalDate date, LocalDate startDate, LocalDate endDate, String restaurantId, String managerId) throws AccessDeniedException {

        ObjectId restaurantObjectId = restaurantId != null ? new ObjectId(restaurantId) : null;

        // If a managerId is provided, verify they own the restaurant
        if (managerId != null && restaurantObjectId != null) {
            verifyManagerOwnership(restaurantObjectId, managerId);
        }

        if (date != null && restaurantObjectId != null) {
            return reservationRepository.findByDateAndRestaurantId(date, restaurantObjectId);
        } else if (startDate != null && endDate != null && restaurantObjectId != null) {
            return reservationRepository.findByDateBetweenAndRestaurantId(startDate, endDate, restaurantObjectId);
        } else if (startDate != null && endDate != null) {
            return reservationRepository.findByDateBetween(startDate, endDate);
        } else if (date != null) {
            return reservationRepository.findByDate(date);
        } else if (restaurantObjectId != null) {
            return reservationRepository.findByRestaurantId(restaurantObjectId);
        } else {
            return reservationRepository.findAll();
        }
    }

    public List<Reservation> getReservationsByCustomerId(ObjectId customerId) {
        return reservationRepository.findByCustomerId(customerId);
    }

    private void verifyManagerOwnership(ObjectId restaurantId, String managerId) throws AccessDeniedException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId.toHexString())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + restaurantId));

        if (!restaurant.getManagerId().equals(managerId)) {
            throw new AccessDeniedException("Manager does not own restaurant with ID: " + restaurantId);
        }
    }
}
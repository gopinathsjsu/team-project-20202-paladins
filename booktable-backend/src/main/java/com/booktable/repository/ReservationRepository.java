package com.booktable.repository;

import com.booktable.model.Reservation;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, ObjectId> {
    @Query(value = "{ 'restaurantId': ?0, 'date': ?1 }", fields = "{ 'tableId': 1, 'startSlotTime': 1, 'endSlotTime': 1 }")
    List<Object[]> findBookedTablesAndTimes(ObjectId restaurantId, LocalDate date);

    List<Reservation> findByRestaurantIdAndTableIdAndDateAndStartSlotTimeAndEndSlotTime(
            ObjectId restaurantId, ObjectId tableId, LocalDate date, LocalTime startSlotTime, LocalTime endSlotTime);

    List<Reservation> findByCustomerId(ObjectId customerId);

    List<Reservation> findByRestaurantId(ObjectId restaurantId);

    List<Reservation> findByTableId(ObjectId tableId);

    List<Reservation> findByDate(LocalDate date);

    List<Reservation> findByStartSlotTime(LocalTime startSlotTime);

    List<Reservation> findByEndSlotTime(LocalTime endSlotTime);

    long countByRestaurantIdAndDate(ObjectId restaurantId, LocalDate date);

    List<Reservation> findByRestaurantIdAndDate(ObjectId objectId, LocalDate date);

    List<Reservation> findByDateAndRestaurantId(LocalDate date, ObjectId restaurantId);

    @Query(value = "{ 'date': { '$gte': ?0, '$lte': ?1 }, 'restaurantId': ObjectId(?2) }")
    List<Reservation> findByDateBetweenAndRestaurantId(LocalDate startDate, LocalDate endDate, ObjectId restaurantId);

    @Query(value = "{ 'date': { '$gte': ?0, '$lte': ?1 } }")
    List<Reservation> findByDateBetween(LocalDate startDate, LocalDate endDate);
}



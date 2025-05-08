package com.booktable.repository;

import com.booktable.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class CustomRestaurantRepositoryImpl implements CustomRestaurantRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Restaurant> searchRestaurants(String city, String state, String zip, int numberOfPeople, LocalDate date, LocalTime startTime, String name) {
        // Match approved restaurants first
        MatchOperation matchApproved = match(Criteria.where("approved").is(true));

        // Existing match operations
        MatchOperation matchCityStateZip = match(Criteria.where("addressCity").regex(city, "i")
                .and("addressState").regex(state, "i")
                .and("addressZip").regex(zip, "i"));

        MatchOperation matchName = match(Criteria.where("name").regex(name, "i"));

        // Existing lookup and complex match operations
        LookupOperation lookupTables = lookup("table", "_id", "restaurantId", "tables");
        LookupOperation lookupReservations = lookup("reservation", "tables._id", "tableId", "reservations");

        // Note: The 'reservations' matching logic for 'time' might need adjustment.
        // If 'reservations.time' stores a specific time, comparing with 'gte(startTime)'
        // needs to be carefully considered for slot overlaps.
        // This logic might be complex to get perfectly right for availability checks.
        MatchOperation matchCapacityAndAvailability = match(Criteria.where("tables").elemMatch(Criteria.where("isActive").is(true)
                        .and("capacity").gte(numberOfPeople))
                // The reservation check logic here is complex and depends heavily on how you store reservation times
                // and define conflicts. This is a placeholder for your existing logic.
                .and("reservations").not().elemMatch(Criteria.where("date").is(date)
                        // This condition needs to correctly model slot non-availability
                        // e.g., !(reservation.startTime < searchEndTime && reservation.endTime > searchStartTime)
                        .and("time").is(startTime)) // Example: check for exact start time conflict, likely needs refinement
        );


        Aggregation aggregation = newAggregation(
                matchApproved,
                matchCityStateZip,
                matchName,
                lookupTables,
                lookupReservations,
                matchCapacityAndAvailability
        );

        return mongoTemplate.aggregate(aggregation, "restaurant", Restaurant.class).getMappedResults();
    }
}
package com.booktable.repository;

import com.booktable.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
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
        MatchOperation matchCityStateZip = match(Criteria.where("addressCity").regex(city, "i")
                .and("addressState").regex(state, "i")
                .and("addressZip").regex(zip, "i"));

        MatchOperation matchName = match(Criteria.where("name").regex(name, "i"));

        LookupOperation lookupTables = lookup("table", "_id", "restaurantId", "tables");

        LookupOperation lookupReservations = lookup("reservation", "tables._id", "tableId", "reservations");

        MatchOperation matchCapacityAndAvailability = match(Criteria.where("tables").elemMatch(Criteria.where("isActive").is(true)
                        .and("capacity").gte(numberOfPeople))
                .and("reservations").not().elemMatch(Criteria.where("date").is(date)
                        .and("time").gte(startTime)));

        Aggregation aggregation = newAggregation(
                matchCityStateZip,
                matchName,
                lookupTables,
                lookupReservations,
                matchCapacityAndAvailability
        );

        return mongoTemplate.aggregate(aggregation, "restaurant", Restaurant.class).getMappedResults();
    }
}
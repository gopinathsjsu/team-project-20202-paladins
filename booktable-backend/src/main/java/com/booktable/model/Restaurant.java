package com.booktable.model;

import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "restaurant")
public class Restaurant {
    @Id
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId id;

    private String name;
    private String description;

    private String addressStreet;
    private String addressCity;
    private String addressState;
    private String addressZip;

    private String phone;
    private String email;
    private String imageUrl;

    private String managerId;

    private BigDecimal coordinatesLatitude;
    private BigDecimal coordinatesLongitude;

    private List<String> cuisines;

    private String cost = "$";

    @CreatedDate
    private LocalDateTime createdAt;

    @NonNull
    private LocalTime openingHour;
    @NonNull
    private LocalTime closingHour;

    private Double averageRating = 0.0;
    private Integer reviewCount = 0;

    private boolean approved;
}

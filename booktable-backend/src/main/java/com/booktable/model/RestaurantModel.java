package com.booktable.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "resturant") // For MongoDB
public class RestaurantModel {
    @Id
    private ObjectId id;
    private String restaurantId;
    private String restaurantName;
}
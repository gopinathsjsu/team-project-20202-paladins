package com.booktable.model;
import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "restaurant") // Corrected spelling
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

    private UUID managerId;

    private BigDecimal coordinatesLatitude;
    private BigDecimal coordinatesLongitude;

    private List<String> cuisines;

    @CreatedDate
    private LocalDateTime createdAt;
}

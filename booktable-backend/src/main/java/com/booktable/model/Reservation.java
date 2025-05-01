package com.booktable.model;


import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
 import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "reservations")
public class Reservation {
    @Id
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId id;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId customerId;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId restaurantId;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId tableId;


    private LocalDate date;

    @NonNull
    private LocalTime startSlotTime;
    @NonNull
    private LocalTime endSlotTime;

    private int partySize;
    private String status;

    private BigDecimal totalAmount;

    @CreatedDate
    private LocalDateTime createdAt;
}

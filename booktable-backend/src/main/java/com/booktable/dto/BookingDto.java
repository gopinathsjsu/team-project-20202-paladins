package com.booktable.dto;

import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class BookingDto {
    @NonNull
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId restaurantId;
    @NonNull
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId tableId;
    @NonNull
    private LocalTime startSlotTime;
    @NonNull
    private LocalTime endSlotTime;
    @NonNull
    private LocalDate date;
    private String tableNumber;
    private String restaurantName;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId reservationId;
}

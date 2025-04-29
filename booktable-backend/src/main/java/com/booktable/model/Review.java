package com.booktable.model;

import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "review")
public class Review {

    @Id
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId id;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId restaurantId;
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId customerId;
    @Min(value = 1)
    @Max(value = 5)
    @NotNull
    private int rating;
    private String comment;
    @CreatedDate
    private LocalDateTime createdAt;
}

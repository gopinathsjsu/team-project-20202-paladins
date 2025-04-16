package com.booktable.model;

import com.booktable.utils.ObjectIdJsonSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "table") // Corrected spelling
public class Table {
    @Id
    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ObjectIdJsonSerializer.class)
    private ObjectId restaurantId;
    private String tableNumber;

    private Integer capacity;
    private Boolean isActive;
}


package com.booktable.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@NoArgsConstructor
public class RatingStats {
    private ObjectId id;
    private Double averageRating;
    private Integer count;
}
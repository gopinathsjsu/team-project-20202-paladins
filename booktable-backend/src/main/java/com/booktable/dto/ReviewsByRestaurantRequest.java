package com.booktable.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.data.domain.Sort;

@Data
public class ReviewsByRestaurantRequest {

    @Min(value = 0, message = "Page number cannot be negative")
    private int page = 0;

    @Min(value = 1, message = "Page size must be at least 1")
    private int size = 10;

    private Sort.Direction direction = Sort.Direction.DESC;

    private String sortProperty = "createdAt";
}
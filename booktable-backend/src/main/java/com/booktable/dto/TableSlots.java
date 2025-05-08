package com.booktable.dto;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class TableSlots {
    private String tableId;
    private List<LocalTime> slot;
}

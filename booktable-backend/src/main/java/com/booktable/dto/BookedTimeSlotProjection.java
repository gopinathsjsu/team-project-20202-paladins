package com.booktable.dto;

import lombok.Value;
import org.bson.types.ObjectId;
import java.time.LocalTime;

/**
 * DTO specifically for projecting booked tableId, start, and end times.
 * Used in ReservationRepository.findBookedTablesAndTimes.
 */
@Value
public class BookedTimeSlotProjection {
    ObjectId tableId;
    LocalTime startSlotTime;
    LocalTime endSlotTime;
}
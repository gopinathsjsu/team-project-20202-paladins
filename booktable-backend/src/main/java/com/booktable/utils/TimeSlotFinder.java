package com.booktable.utils;

import java.time.*;
import java.util.*;

public class TimeSlotFinder {

    public static void main(String[] args) {
        // Working window
        LocalTime workStart = LocalTime.of(9, 0);
        LocalTime workEnd = LocalTime.of(16, 0);

        // Booked slot format: [tableId, [start, end]]
        Set<List<Object>> bookedSlots = new HashSet<>();
//        bookedSlots.add(Arrays.asList("T1", Arrays.asList(LocalTime.of(9, 0), LocalTime.of(10, 0))));
//        bookedSlots.add(Arrays.asList("T1", Arrays.asList(LocalTime.of(14, 0), LocalTime.of(15, 0))));
//        bookedSlots.add(Arrays.asList("T2", Arrays.asList(LocalTime.of(10, 0), LocalTime.of(11, 0))));

        // Requested start
        LocalTime requestedStart = LocalTime.of(9, 00);

        Set<String> tableIds = new HashSet<>(Arrays.asList("T1", "T2"));

        List<List<Object>> result = findClosestSlots(workStart, workEnd, bookedSlots, requestedStart, tableIds);

        // Print result
        System.out.println("Available 15-min Slots:");
        for (List<Object> slot : result) {
            String tableId = (String) slot.get(0);
            List<LocalTime> timeSlot = (List<LocalTime>) slot.get(1);
            System.out.println("Table " + tableId + ": " + timeSlot.get(0) + " - " + timeSlot.get(1));
        }
    }

    public static List<List<Object>> findClosestSlots(LocalTime workStart,
                                                           LocalTime workEnd,
                                                           Set<List<Object>> bookedSlotObjects,
                                                           LocalTime requestedStart,
                                                           Set<String> tableIds) {
        Map<String, List<List<LocalTime>>> bookedByTable = new HashMap<>();

        // Organize booked slots by table
        for (List<Object> entry : bookedSlotObjects) {
            String tableId = (String) entry.get(0);
            List<LocalTime> interval = (List<LocalTime>) entry.get(1);

            bookedByTable.putIfAbsent(tableId, new ArrayList<>());
            bookedByTable.get(tableId).add(interval);
        }

        // List of all valid 15-min slots from all tables
        List<List<Object>> all15MinSlots = new ArrayList<>();

        for (Map.Entry<String, List<List<LocalTime>>> entry : bookedByTable.entrySet()) {
            String tableId = entry.getKey();
            if (!tableIds.contains(tableId)) continue;
            List<List<LocalTime>> booked = entry.getValue();
            booked.sort(Comparator.comparing(slot -> slot.get(0)));

            List<List<LocalTime>> freeSlots = new ArrayList<>();
            LocalTime prevEnd = workStart;

            for (List<LocalTime> slot : booked) {
                LocalTime start = slot.get(0);
                LocalTime end = slot.get(1);
                if (start.isAfter(prevEnd)) {
                    freeSlots.add(Arrays.asList(prevEnd, start));
                }
                if (end.isAfter(prevEnd)) {
                    prevEnd = end;
                }
            }

            if (prevEnd.isBefore(workEnd)) {
                freeSlots.add(Arrays.asList(prevEnd, workEnd));
            }

            List<List<Object>> tableSlots = new ArrayList<>();
            for (List<LocalTime> free : freeSlots) {
                LocalTime start = free.get(0);
                LocalTime end = free.get(1);
                while (!start.plusHours(1).isAfter(end)) {
                    tableSlots.add(Arrays.asList(tableId, Arrays.asList(start, start.plusHours(1))));
                    start = start.plusMinutes(30);
                }
            }
            for (List<Object> slot : tableSlots) {
                LocalTime slotStart = ((List<LocalTime>) slot.get(1)).get(0);
                if (!slotStart.isBefore(requestedStart)) {
                    all15MinSlots.add(slot);
                }
            }
        }

        // Also add all slots for tables with no bookings
        for (String tableId : tableIds) {
            if (!bookedByTable.containsKey(tableId)) {
                LocalTime start = workStart;
                while (!start.plusHours(1).isAfter(workEnd)) {
                    if (!start.isBefore(requestedStart)) {
                        all15MinSlots.add(Arrays.asList(tableId, Arrays.asList(start, start.plusHours(1))));
                    }
                    start = start.plusMinutes(30);
                }
            }
        }

        // Sort all slots by start time in chronological order
        all15MinSlots.sort(Comparator.comparing(slot -> ((List<LocalTime>) slot.get(1)).get(0)));

        // Return top 3
        return all15MinSlots.subList(0, Math.min(3, all15MinSlots.size()));
    }
}

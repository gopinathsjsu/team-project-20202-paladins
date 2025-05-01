// src/main/java/com/booktable/service/TableService.java
package com.booktable.service;

import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.repository.TableRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.booktable.utils.TimeSlotFinder.findClosestSlots;

@Service
public class TableService {

    private final TableRepository     tableRepository;
    private final ReservationService  reservationService;
    private final RestaurantService   restaurantService;

    @Autowired
    public TableService(TableRepository tableRepository,
                        ReservationService reservationService,
                        RestaurantService restaurantService) {
        this.tableRepository   = tableRepository;
        this.reservationService = reservationService;
        this.restaurantService  = restaurantService;
    }

    /* ───────── helpers ───────── */

    public boolean existsTableWithCapacity(ObjectId restaurantId, int partySize) {
        return tableRepository.findByRestaurantId(restaurantId).stream()
                .anyMatch(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getCapacity() >= partySize);
    }

    /* ───────── CRUD passthroughs ───────── */

    public Table getTableById(ObjectId tableId) {
        return tableRepository.findById(tableId.toString())
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    public Table saveTable(Table table) {
        return tableRepository.save(table);
    }

    public List<Table> saveTables(List<Table> tables) {
        return tableRepository.saveAll(tables);
    }

    /* ───────── capacity-aware slot finder ───────── */

    public List<List<Object>> getBestAvailableTimeSlots(ObjectId restaurantId,
                                                        LocalTime requestStart,
                                                        LocalDate date,
                                                        Integer partySize) {

        /* gather active tables large enough (or all if partySize == null) */
        List<Table> candidates = tableRepository.findByRestaurantId(restaurantId).stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                .filter(t -> partySize == null || t.getCapacity() >= partySize)
                .toList();

        if (candidates.isEmpty()) return List.of();

        Set<String> candidateIds = candidates.stream()
                .map(t -> t.getId().toString())
                .collect(Collectors.toSet());

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        LocalTime openingHour = restaurant.getOpeningHour();
        LocalTime closingHour = restaurant.getClosingHour();

        if (requestStart.isBefore(openingHour) ||
                requestStart.isAfter(closingHour.minusHours(1))) {
            return List.of(List.of("N/A", List.of(openingHour, openingHour.plusHours(1))));
        }

        Set<List<Object>> booked = reservationService
                .getBookedTablesAndTimes(restaurantId, date);

        return findClosestSlots(openingHour, closingHour,
                booked, requestStart, candidateIds);
    }

    /* legacy overload kept for existing callers */
    public List<List<Object>> getBestAvailableTimeSlots(ObjectId restaurantId,
                                                        LocalTime requestStart,
                                                        LocalDate date) {
        return getBestAvailableTimeSlots(restaurantId, requestStart, date, null);
    }

    /* ───────── other public helpers (unchanged) ───────── */

    public List<List<Object>> getAvaiableTables(ObjectId restaurantId, LocalDate date) {
        Set<List<Object>> booked = reservationService.getBookedTablesAndTimes(restaurantId, date);
        List<Table> allTables = tableRepository.findByRestaurantId(restaurantId);

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        LocalTime openingHour = restaurant.getOpeningHour();
        LocalTime closingHour = restaurant.getClosingHour();

        Set<List<Object>> freeTables = new HashSet<>();
        Set<List<LocalTime>> presentSlots = new HashSet<>();

        for (Table table : allTables) {
            LocalTime current = openingHour;
            while (!current.plusHours(1).isAfter(closingHour)) {
                LocalTime end = current.plusHours(1);
                List<LocalTime> slot = List.of(current, end);
                List<Object> entry = List.of(String.valueOf(table.getId()), slot);

                current = end;
                if (booked.contains(entry) || presentSlots.contains(slot)) continue;

                freeTables.add(entry);
                presentSlots.add(slot);
            }
        }

        return freeTables.stream()
                .sorted(Comparator.comparing(a -> (LocalTime) ((List<?>) a.get(1)).get(0)))
                .toList();
    }
}

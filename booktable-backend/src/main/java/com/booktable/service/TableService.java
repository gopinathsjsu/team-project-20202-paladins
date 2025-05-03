package com.booktable.service;

import com.booktable.dto.TableDetails;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.repository.TableRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.booktable.utils.TimeSlotFinder.findClosestSlots;

@Service
public class TableService {
    private final TableRepository tableRepository;
    private final ReservationService reservationService;
    private final RestaurantService restaurantService;


    @Autowired
    public TableService(TableRepository tableRepository, ReservationService reservationService, RestaurantService restaurantService) {
        this.tableRepository = tableRepository;
        this.reservationService = reservationService;
        this.restaurantService = restaurantService;
    }

    public Table getTableById(ObjectId tableId) {
        return tableRepository.findById(tableId.toString())
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    public void deleteTablesByRestaurantId(String restaurantId) {
        tableRepository.deleteByRestaurantId(new ObjectId(restaurantId));
    }

    public void createTablesForRestaurant(String restaurantId, TableDetails tableDetails) {
        List<Table> tables = new ArrayList<>();

        for (int i = 0; i < tableDetails.getCount(); i++) {
            Table table = new Table();
            table.setRestaurantId(new ObjectId(restaurantId));
            table.setTableNumber(String.valueOf(i + 1));
            table.setCapacity(tableDetails.getCapacity());
            table.setIsActive(true); // All new tables are active by default
            tables.add(table);
        }
        tableRepository.saveAll(tables);
    }

    public Table saveTable(Table table) {
        return tableRepository.save(table);
    }

    public List<Table> saveTables(List<Table> tables) {
        return tableRepository.saveAll(tables);
    }

    public List<List<Object>> getBestAvailableTimeSlots(ObjectId restaurantId, LocalTime requestStart,LocalDate date, int resultCount) {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        LocalTime openingHour = restaurant.getOpeningHour();
        LocalTime closingHour = restaurant.getClosingHour();

        // Check if request is within operating hours
        if (requestStart.isBefore(openingHour) || requestStart.isAfter(closingHour.minusHours(1))) {
            return List.of();
        }

        // Get all reservations for the restaurant on the given date
        Set<List<Object>> bookedTables = reservationService.getBookedTablesAndTimes(restaurantId, date);

        // Get all tables for the restaurant
        List<Table> allTables = tableRepository.findByRestaurantId(restaurantId);
        Set<String> tableIds = allTables.stream()
                .map(table -> table.getId().toString())
                .collect(Collectors.toSet());

//        List<List<Object>> availableSlots = new ArrayList<>();

        List<List<Object>> slots = findClosestSlots(openingHour, closingHour, bookedTables, requestStart, tableIds, resultCount);

//        return slots;
//        return availableSlots.stream()
//                .sorted((a, b) -> ((LocalTime) ((List<?>) a.get(1)).get(0))
//                        .compareTo((LocalTime) ((List<?>) b.get(1)).get(0)))
//                .limit(3)
//                .toList();
        return slots;
    }


    public List<List<Object>> getAvaiableTables(ObjectId restaurantId, LocalDate date) {
        Set<List<Object>> bookedTables = reservationService.getBookedTablesAndTimes(restaurantId, date);
        List<Table> allTables = tableRepository.findByRestaurantId(restaurantId);

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        LocalTime openingHour = restaurant.getOpeningHour();
        LocalTime closingHour = restaurant.getClosingHour();


        Set<List<Object>> freeTables = new HashSet<>();
        Set<List<LocalTime>> presentSlots = new HashSet<>();


        for (Table table : allTables) {
            LocalTime currentTime = openingHour;
            while (currentTime.plusHours(1).isBefore(closingHour) || currentTime.plusHours(1).equals(closingHour)) {
                LocalTime endTime = currentTime.plusHours(1);

                List<LocalTime> slot = List.of(currentTime, endTime);
                List<Object> ll = List.of(String.valueOf(table.getId()), slot);

                currentTime = endTime;
                if (bookedTables.contains(ll)) {
                    continue;
                }

                if (presentSlots.contains(slot)) {
                    continue;
                }

                freeTables.add(ll);
                presentSlots.add(slot);

            }
        }


//        Set<List<Object>> availableTables = new HashSet<>(freeTables);
//        availableTables.removeAll(bookedTables);


        return new ArrayList<>(freeTables).stream()
                .sorted((a, b) -> ((LocalTime) ((List<?>) a.get(1)).get(0))
                        .compareTo((LocalTime) ((List<?>) b.get(1)).get(0)))
                .toList();

    }
//


}


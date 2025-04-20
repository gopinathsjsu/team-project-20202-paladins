package com.booktable.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.repository.TableRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Table saveTable(Table table) {
        return tableRepository.save(table);
    }

    public List<Table> saveTables(List<Table> tables) {
        return tableRepository.saveAll(tables);
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


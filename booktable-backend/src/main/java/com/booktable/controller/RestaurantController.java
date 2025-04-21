package com.booktable.controller;

import com.booktable.dto.RestaurantTableInput;
import com.booktable.dto.RestaurantTableOutput;
import com.booktable.dto.TableSlots;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

//Display a list of restaurants that have availability at the specified time +/- 30minutes - with
// Name, Cuisine type, Cost rating, Reviews and Ratings, and #of times booked today,
// display clickable buttons with available times - that can be clicked to book the table

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final TableService tableService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService, TableService tableService) {
        this.restaurantService = restaurantService;
        this.tableService = tableService;
    }

    @GetMapping("/search")
    public List<RestaurantTableOutput> searchRestaurants(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String zip,
            @RequestParam(required = false) String noOfPeople,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {

        List<Restaurant> restaurants = restaurantService.searchRestaurants(city, state, zip, noOfPeople, startTime, endTime);

        List<RestaurantTableOutput> restaurantTableOutputs = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            RestaurantTableOutput restaurantTableOutput = new RestaurantTableOutput();

            List<TableSlots> tableSlots = new ArrayList<>();
            for (List<Object> tableData : tableService.getAvaiableTables(restaurant.getId(), LocalDate.now())) {
                TableSlots slot = new TableSlots();
                slot.setTableId(String.valueOf(tableData.get(0)));
                slot.setSlot((List<LocalTime>) tableData.get(1));
                tableSlots.add(slot);
            }

            restaurantTableOutput.setRestaurant(restaurant);
            restaurantTableOutput.setTableSlots(tableSlots);

            restaurantTableOutputs.add(restaurantTableOutput);
        }

        return restaurantTableOutputs;
    }

    // Get a single restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return restaurantService.getRestaurantById(id);
    }

    // List all restaurants
    @GetMapping
    public List<Restaurant> listRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return restaurantService.listRestaurants(page, size);
    }

    // Create a new restaurant
    @PreAuthorize("hasAuthority('RESTAURANT_MANAGER')")
    @PostMapping
    public Restaurant addRestaurant(@RequestBody RestaurantTableInput restaurantTable) {
        Restaurant res = restaurantService.saveRestaurant(restaurantTable.getRestaurant());

        List<Table> tables = new ArrayList<>();
        for (int i = 0; i < restaurantTable.getTable().getCount(); i++) {
            Table table = new Table();
            table.setRestaurantId(res.getId());
            table.setTableNumber(String.valueOf(i + 1));
            table.setCapacity(restaurantTable.getTable().getCapacity());
            table.setIsActive(true);
            tables.add(table);
        }
        tableService.saveTables(tables);
        return res;
    }

    // Update an existing restaurant (full update)
    @PreAuthorize("hasAuthority('RESTAURANT_MANAGER')")
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return restaurantService.updateRestaurant(id, restaurant);
    }

    // Partially update an existing restaurant
    @PreAuthorize("hasAuthority('RESTAURANT_MANAGER')")
    @PatchMapping("/{id}")
    public Restaurant patchRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return restaurantService.patchRestaurant(id, restaurant);
    }

    // Delete a restaurant by ID
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
    }
}
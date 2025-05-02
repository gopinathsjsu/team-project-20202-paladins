package com.booktable.controller;

import com.booktable.dto.RestaurantInput;
import com.booktable.dto.RestaurantTableInput;
import com.booktable.dto.RestaurantTableOutput;
import com.booktable.dto.TableSlots;
import com.booktable.mapper.RestaurantMapper;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.model.User;
import com.booktable.service.ReservationService;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

//Display a list of restaurants that have availability at the specified time +/- 30minutes - with
// Name, Cuisine type, Cost rating, Reviews and Ratings, and #of times booked today,
// display clickable buttons with available times - that can be clicked to book the table

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final ReservationService reservationService;
    private final TableService tableService;
    private final RestaurantMapper restaurantMapper;

    @Autowired
    public RestaurantController(RestaurantService restaurantService, TableService tableService,
                                RestaurantMapper restaurantMapper,
                                ReservationService reservationService
    ) {
        this.restaurantService = restaurantService;
        this.tableService = tableService;
        this.restaurantMapper = restaurantMapper;
        this.reservationService = reservationService;
    }

    @GetMapping("/search")
    public List<RestaurantTableOutput> searchRestaurants(
            @RequestParam(name = "restaurant", required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String zip,
            @RequestParam(name = "partySize", required = false) String noOfPeople,
            @RequestParam(required = false) LocalTime startTime
    ) {

        List<Restaurant> restaurants = restaurantService.searchRestaurants(name, city, state, zip, noOfPeople, startTime);

        List<RestaurantTableOutput> restaurantTableOutputs = new ArrayList<>();
        for (Restaurant restaurant : restaurants) {
            RestaurantTableOutput restaurantTableOutput = new RestaurantTableOutput();

            List<TableSlots> tableSlots = new ArrayList<>();
            for (List<Object> tableData : tableService.getBestAvailableTimeSlots(restaurant.getId(),
                    startTime, LocalDate.now(), 3)) {
                TableSlots slot = new TableSlots();
                slot.setTableId(String.valueOf(tableData.get(0)));
                slot.setSlot((List<LocalTime>) tableData.get(1));
                tableSlots.add(slot);
            }

            restaurantTableOutput.setRestaurant(restaurant);
            restaurantTableOutput.setTableSlots(tableSlots);
            restaurantTableOutput.setNoOfTimesBookedToday(reservationService.countReservationsForDate(
                    restaurant.getId(), LocalDate.now()
            ));

            restaurantTableOutputs.add(restaurantTableOutput);
        }

        // todo #of times booked today
        return restaurantTableOutputs;
    }

    // Get a single restaurant by ID
    @GetMapping("/{id}")
    public RestaurantTableOutput getRestaurantById(@PathVariable String id,
                                                   @RequestParam(required = false) LocalTime startTime
    ) {
        RestaurantTableOutput restaurantTableOutput = new RestaurantTableOutput();
        Restaurant restaurant = restaurantService.getRestaurantById(id);

        if (startTime == null) {
            startTime = LocalTime.now();
        }

        List<TableSlots> tableSlots = new ArrayList<>();
        for (List<Object> tableData : tableService.getBestAvailableTimeSlots(restaurant.getId(),
                startTime, LocalDate.now(), 15)) {
            TableSlots slot = new TableSlots();
            slot.setTableId(String.valueOf(tableData.get(0)));
            slot.setSlot((List<LocalTime>) tableData.get(1));
            tableSlots.add(slot);
        }

        restaurantTableOutput.setRestaurant(restaurant);
        restaurantTableOutput.setTableSlots(tableSlots);
        restaurantTableOutput.setNoOfTimesBookedToday(reservationService.countReservationsForDate(
                restaurant.getId(), LocalDate.now()
        ));
        return restaurantTableOutput;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        RestaurantInput restaurantInput = restaurantTable.getRestaurantInput();
        Restaurant res = restaurantMapper.toEntity(restaurantInput, currentUser.getId());

        // Save restaurant to database
        res = restaurantService.saveRestaurant(res);

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
    public Restaurant updateRestaurant(@PathVariable String id, @RequestBody RestaurantTableInput restaurantTable) {
        return restaurantService.updateRestaurant(id, restaurantTable);
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
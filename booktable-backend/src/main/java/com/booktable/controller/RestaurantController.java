// src/main/java/com/booktable/controller/RestaurantController.java
package com.booktable.controller;

import com.booktable.dto.RestaurantInput;
import com.booktable.dto.RestaurantTableInput;
import com.booktable.dto.RestaurantTableOutput;
import com.booktable.dto.TableSlots;
import com.booktable.mapper.RestaurantMapper;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.service.RestaurantService;
import com.booktable.service.TableService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/restaurant")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class RestaurantController {

    private final RestaurantService  restaurantService;
    private final TableService       tableService;
    private final RestaurantMapper   restaurantMapper;

    /* ───────────────────────────────────────────────────────────── */

    @GetMapping("/search")
    public List<RestaurantTableOutput> searchRestaurants(
            @RequestParam(required = false) String  restaurant,
            @RequestParam(required = false) String  city,
            @RequestParam(required = false) String  state,
            @RequestParam(required = false) String  zip,
            @RequestParam(required = false) Integer partySize,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime
    ) {

        /* 1) fetch restaurants by text / location (repo can ignore partySize) */
        List<Restaurant> initial = restaurantService
                .searchRestaurants(restaurant, city, state, zip, String.valueOf(partySize), startTime);

        /* 2) keep only restaurants that own at least one active table ≥ partySize */
        if (partySize != null) {
            initial = initial.stream()
                    .filter(r -> tableService.existsTableWithCapacity(r.getId(), partySize))
                    .toList();
        }

        /* 3) build output DTOs with capacity-aware slot search */
        List<RestaurantTableOutput> out = new ArrayList<>();

        for (Restaurant res : initial) {

            List<TableSlots> slotDtos = new ArrayList<>();

            for (List<Object> row : tableService.getBestAvailableTimeSlots(
                    res.getId(), startTime, LocalDate.now(), partySize)) {

                TableSlots ts = new TableSlots();
                ts.setTableId(String.valueOf(row.get(0)));
                ts.setSlot((List<LocalTime>) row.get(1));
                slotDtos.add(ts);
            }

            RestaurantTableOutput dto = new RestaurantTableOutput();
            dto.setRestaurant(res);
            dto.setTableSlots(slotDtos);
            out.add(dto);
        }

        return out;
    }

    /* ───────── remaining CRUD endpoints unchanged ───────── */

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return restaurantService.getRestaurantById(id);
    }

    @GetMapping
    public List<Restaurant> listRestaurants(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return restaurantService.listRestaurants(page, size);
    }

    @PostMapping
    public Restaurant addRestaurant(@RequestBody RestaurantTableInput payload) {
        Restaurant res = restaurantMapper.toEntity(payload.getRestaurantInput(), "123");
        res = restaurantService.saveRestaurant(res);

        List<Table> tables = new ArrayList<>();
        for (int i = 0; i < payload.getTable().getCount(); i++) {
            Table t = new Table();
            t.setRestaurantId(res.getId());
            t.setTableNumber(String.valueOf(i + 1));
            t.setCapacity(payload.getTable().getCapacity());
            t.setIsActive(true);
            tables.add(t);
        }
        tableService.saveTables(tables);
        return res;
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(@PathVariable String id,
                                       @RequestBody Restaurant restaurant) {
        return restaurantService.updateRestaurant(id, restaurant);
    }

    @PatchMapping("/{id}")
    public Restaurant patchRestaurant(@PathVariable String id,
                                      @RequestBody Restaurant restaurant) {
        return restaurantService.patchRestaurant(id, restaurant);
    }

    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
    }
}

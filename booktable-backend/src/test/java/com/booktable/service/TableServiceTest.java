package com.booktable.service;

import com.booktable.dto.TableDetails;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.repository.TableRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TableServiceTest {

    @Mock
    private TableRepository tableRepository;

    @Mock
    private ReservationService reservationService;

    @Mock
    private RestaurantService restaurantService;

    @InjectMocks
    private TableService tableService;

    private ObjectId restaurantId;
    private ObjectId tableId;
    private Restaurant mockRestaurant;
    private Table mockTable;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        restaurantId = new ObjectId();
        tableId = new ObjectId();

        mockRestaurant = new Restaurant();
        mockRestaurant.setId(restaurantId);
        mockRestaurant.setOpeningHour(LocalTime.of(9, 0));
        mockRestaurant.setClosingHour(LocalTime.of(22, 0));

        mockTable = new Table();
        mockTable.setId(tableId);
        mockTable.setRestaurantId(restaurantId);
        mockTable.setTableNumber("1");
        mockTable.setCapacity(4);
        mockTable.setIsActive(true);
    }

    @Test
    void getTableById_ShouldReturnTable() {
        // Arrange
        when(tableRepository.findById(tableId.toString()))
            .thenReturn(Optional.of(mockTable));

        // Act
        Table result = tableService.getTableById(tableId);

        // Assert
        assertNotNull(result);
        assertEquals(mockTable, result);
        verify(tableRepository).findById(tableId.toString());
    }

    @Test
    void getTableById_ShouldThrowException_WhenTableNotFound() {
        // Arrange
        when(tableRepository.findById(any())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            tableService.getTableById(tableId)
        );
    }

    @Test
    void deleteTablesByRestaurantId_ShouldDeleteTables() {
        // Arrange
        doNothing().when(tableRepository).deleteByRestaurantId(any(ObjectId.class));

        // Act
        tableService.deleteTablesByRestaurantId(restaurantId.toHexString());

        // Assert
        verify(tableRepository).deleteByRestaurantId(any(ObjectId.class));
    }

    @Test
    void createTablesForRestaurant_ShouldCreateTables() {
        // Arrange
        TableDetails tableDetails = new TableDetails();
        tableDetails.setCount(3);
        tableDetails.setCapacity(4);

        when(tableRepository.saveAll(any())).thenReturn(Collections.singletonList(mockTable));

        // Act
        tableService.createTablesForRestaurant(restaurantId.toHexString(), tableDetails);

        // Assert
        verify(tableRepository).saveAll(any());
    }

    @Test
    void saveTable_ShouldSaveAndReturnTable() {
        // Arrange
        when(tableRepository.save(any(Table.class))).thenReturn(mockTable);

        // Act
        Table result = tableService.saveTable(mockTable);

        // Assert
        assertNotNull(result);
        assertEquals(mockTable, result);
        verify(tableRepository).save(mockTable);
    }

    @Test
    void saveTables_ShouldSaveAndReturnTables() {
        // Arrange
        List<Table> tables = Collections.singletonList(mockTable);
        when(tableRepository.saveAll(any())).thenReturn(tables);

        // Act
        List<Table> result = tableService.saveTables(tables);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockTable, result.get(0));
        verify(tableRepository).saveAll(tables);
    }

    @Test
    void getBestAvailableTimeSlots_ShouldReturnSlots() {
        // Arrange
        LocalTime requestStart = LocalTime.of(12, 0);
        LocalDate date = LocalDate.now();
        int resultCount = 3;

        when(restaurantService.getRestaurantById(restaurantId)).thenReturn(mockRestaurant);
        when(tableRepository.findByRestaurantId(restaurantId)).thenReturn(Collections.singletonList(mockTable));
        when(reservationService.getBookedTablesAndTimes(restaurantId, date)).thenReturn(new HashSet<>());

        // Act
        List<List<Object>> result = tableService.getBestAvailableTimeSlots(restaurantId, requestStart, date, resultCount);

        // Assert
        assertNotNull(result);
        verify(restaurantService).getRestaurantById(restaurantId);
        verify(tableRepository).findByRestaurantId(restaurantId);
        verify(reservationService).getBookedTablesAndTimes(restaurantId, date);
    }

    @Test
    void getBestAvailableTimeSlots_ShouldReturnEmptyList_WhenOutsideOperatingHours() {
        // Arrange
        LocalTime requestStart = LocalTime.of(7, 0); // Before opening hours
        LocalDate date = LocalDate.now();
        int resultCount = 3;

        when(restaurantService.getRestaurantById(restaurantId)).thenReturn(mockRestaurant);

        // Act
        List<List<Object>> result = tableService.getBestAvailableTimeSlots(restaurantId, requestStart, date, resultCount);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(restaurantService).getRestaurantById(restaurantId);
        verify(tableRepository, never()).findByRestaurantId(any());
        verify(reservationService, never()).getBookedTablesAndTimes(any(), any());
    }

    @Test
    void getAvailableTables_ShouldReturnAvailableTables() {
        // Arrange
        LocalDate date = LocalDate.now();
        when(restaurantService.getRestaurantById(restaurantId)).thenReturn(mockRestaurant);
        when(tableRepository.findByRestaurantId(restaurantId)).thenReturn(Collections.singletonList(mockTable));
        when(reservationService.getBookedTablesAndTimes(restaurantId, date)).thenReturn(new HashSet<>());

        // Act
        List<List<Object>> result = tableService.getAvaiableTables(restaurantId, date);

        // Assert
        assertNotNull(result);
        verify(restaurantService).getRestaurantById(restaurantId);
        verify(tableRepository).findByRestaurantId(restaurantId);
        verify(reservationService).getBookedTablesAndTimes(restaurantId, date);
    }
} 
package com.booktable.service;

import com.booktable.dto.BookedTimeSlotProjection;
import com.booktable.exception.CancellationNotAllowedException;
import com.booktable.exception.ReservationNotFoundException;
import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.model.User;
import com.booktable.repository.ReservationRepository;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.TableRepository;
import com.booktable.repository.UserRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TableRepository tableRepository;

    @Mock
    private MailjetEmailService mailjetEmailService;

    @InjectMocks
    private ReservationService reservationService;

    private ObjectId reservationId;
    private ObjectId customerId;
    private ObjectId restaurantId;
    private ObjectId tableId;
    private Reservation mockReservation;
    private User mockUser;
    private Restaurant mockRestaurant;
    private Table mockTable;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        reservationId = new ObjectId();
        customerId = new ObjectId();
        restaurantId = new ObjectId();
        tableId = new ObjectId();

        mockUser = new User();
        mockUser.setId(customerId.toHexString());
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");

        mockRestaurant = new Restaurant();
        mockRestaurant.setId(restaurantId);
        mockRestaurant.setName("Test Restaurant");
        mockRestaurant.setAddressStreet("123 Test St");
        mockRestaurant.setAddressCity("Test City");

        mockTable = new Table();
        mockTable.setId(tableId);
        mockTable.setTableNumber("1");

        mockReservation = new Reservation();
        mockReservation.setId(reservationId);
        mockReservation.setCustomerId(customerId);
        mockReservation.setRestaurantId(restaurantId);
        mockReservation.setTableId(tableId);
        mockReservation.setDate(LocalDate.now());
        mockReservation.setStartSlotTime(LocalTime.of(12, 0));
        mockReservation.setEndSlotTime(LocalTime.of(13, 0));
        mockReservation.setPartySize(4);
        mockReservation.setStatus(Reservation.STATUS_CONFIRMED);
    }

    @Test
    void saveReservation_ShouldSaveAndSendEmail() {
        // Arrange
        when(reservationRepository.save(any(Reservation.class))).thenReturn(mockReservation);
        when(userRepository.findById(customerId.toHexString())).thenReturn(Optional.of(mockUser));
        when(restaurantRepository.findById(restaurantId.toHexString())).thenReturn(Optional.of(mockRestaurant));
        when(tableRepository.findById(tableId.toHexString())).thenReturn(Optional.of(mockTable));
        when(reservationRepository.findByRestaurantIdAndTableIdAndDateAndStartSlotTimeAndEndSlotTime(
            any(), any(), any(), any(), any())).thenReturn(Collections.emptyList());
        doNothing().when(mailjetEmailService).sendEmail(any(), any(), any());

        // Act
        Reservation result = reservationService.saveReservation(mockReservation);

        // Assert
        assertNotNull(result);
        assertEquals(mockReservation, result);
        verify(reservationRepository).save(mockReservation);
        verify(mailjetEmailService).sendEmail(any(), any(), any());
    }

    @Test
    void saveReservation_ShouldThrowException_WhenDuplicateReservation() {
        // Arrange
        when(reservationRepository.findByRestaurantIdAndTableIdAndDateAndStartSlotTimeAndEndSlotTime(
            any(), any(), any(), any(), any())).thenReturn(Collections.singletonList(mockReservation));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> 
            reservationService.saveReservation(mockReservation)
        );
    }

    @Test
    void cancelReservation_ShouldCancelReservation() throws AccessDeniedException {
        // Arrange
        LocalDateTime futureDateTime = LocalDateTime.now().plusDays(1);
        mockReservation.setDate(futureDateTime.toLocalDate());
        mockReservation.setStartSlotTime(futureDateTime.toLocalTime());

        when(reservationRepository.findByIdAndCustomerId(reservationId, customerId))
            .thenReturn(Optional.of(mockReservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(mockReservation);

        // Act
        boolean result = reservationService.cancelReservation(reservationId, customerId);

        // Assert
        assertTrue(result);
        assertEquals(Reservation.STATUS_CANCELLED, mockReservation.getStatus());
        verify(reservationRepository).save(mockReservation);
    }

    @Test
    void cancelReservation_ShouldThrowException_WhenReservationNotFound() {
        // Arrange
        when(reservationRepository.findByIdAndCustomerId(any(), any())).thenReturn(Optional.empty());
        when(reservationRepository.existsById(any())).thenReturn(false);

        // Act & Assert
        assertThrows(ReservationNotFoundException.class, () -> 
            reservationService.cancelReservation(reservationId, customerId)
        );
    }

    @Test
    void cancelReservation_ShouldThrowException_WhenNotAuthorized() {
        // Arrange
        when(reservationRepository.findByIdAndCustomerId(any(), any())).thenReturn(Optional.empty());
        when(reservationRepository.existsById(any())).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            reservationService.cancelReservation(reservationId, customerId)
        );
    }

    @Test
    void cancelReservation_ShouldThrowException_WhenWithinCancellationWindow() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        mockReservation.setDate(now.toLocalDate());
        mockReservation.setStartSlotTime(now.toLocalTime().plusHours(1));

        when(reservationRepository.findByIdAndCustomerId(reservationId, customerId))
            .thenReturn(Optional.of(mockReservation));

        // Act & Assert
        assertThrows(CancellationNotAllowedException.class, () -> 
            reservationService.cancelReservation(reservationId, customerId)
        );
    }

    @Test
    void getBookedTablesAndTimes_ShouldReturnBookedSlots() {
        // Arrange
        LocalDate date = LocalDate.now();
        BookedTimeSlotProjection mockProjection = mock(BookedTimeSlotProjection.class);
        when(mockProjection.getTableId()).thenReturn(tableId);
        when(mockProjection.getStartSlotTime()).thenReturn(LocalTime.of(12, 0));
        when(mockProjection.getEndSlotTime()).thenReturn(LocalTime.of(13, 0));

        when(reservationRepository.findBookedTablesAndTimes(restaurantId, date))
            .thenReturn(Collections.singletonList(mockProjection));

        // Act
        Set<List<Object>> result = reservationService.getBookedTablesAndTimes(restaurantId, date);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        verify(reservationRepository).findBookedTablesAndTimes(restaurantId, date);
    }

    @Test
    void countReservationsForDate_ShouldReturnCount() {
        // Arrange
        LocalDate date = LocalDate.now();
        when(reservationRepository.countByRestaurantIdAndDate(restaurantId, date)).thenReturn(5L);

        // Act
        int result = reservationService.countReservationsForDate(restaurantId, date);

        // Assert
        assertEquals(5, result);
        verify(reservationRepository).countByRestaurantIdAndDate(restaurantId, date);
    }

    @Test
    void getReservationsByCustomerId_ShouldReturnCustomerReservations() {
        // Arrange
        List<Reservation> expectedReservations = Collections.singletonList(mockReservation);
        when(reservationRepository.findByCustomerId(customerId)).thenReturn(expectedReservations);

        // Act
        List<Reservation> result = reservationService.getReservationsByCustomerId(customerId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockReservation, result.get(0));
        verify(reservationRepository).findByCustomerId(customerId);
    }
} 
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);
    private static final long CANCELLATION_WINDOW_HOURS = 2;
    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository; // Added
    private final TableRepository tableRepository;   // Added
    private final MailjetEmailService mailjetEmailService;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, RestaurantRepository restaurantRepository, UserRepository userRepository,
                              TableRepository tableRepository,
                              MailjetEmailService mailjetEmailService) {
        this.reservationRepository = reservationRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
        this.mailjetEmailService = mailjetEmailService;
    }

    public Reservation saveReservation(Reservation reservation) {

        if (reservation.getStatus() == null) {
            reservation.setStatus(Reservation.STATUS_CONFIRMED);
            log.debug("Setting default status to CONFIRMED for reservation");
        }

        if (isDuplicateReservation(reservation)) {
            log.warn("Attempt to save duplicate reservation: {}", reservation);
            throw new IllegalArgumentException("Duplicate reservation: This reservation already exists.");
        }

        // Save the reservation first
        Reservation savedReservation = reservationRepository.save(reservation);

        try {
            // Fetch User details to get email
            Optional<User> userOpt = userRepository.findById(savedReservation.getCustomerId().toHexString()); //

            // Fetch Restaurant details
            Optional<Restaurant> restaurantOpt = restaurantRepository.findById(savedReservation.getRestaurantId().toHexString()); //

            // Fetch Table details
            Optional<Table> tableOpt = tableRepository.findById(savedReservation.getTableId().toHexString()); //


            if (userOpt.isPresent() && restaurantOpt.isPresent() && tableOpt.isPresent()) {
                User user = userOpt.get();
                Restaurant restaurant = restaurantOpt.get();
                Table table = tableOpt.get();

                String recipientEmail = user.getEmail(); //
                String subject = "Your Booking Confirmation at " + restaurant.getName();

                // Compose a simple email body
                String messageBody = String.format(
                        "Dear %s,\n\n" +
                                "Your booking is confirmed!\n\n" +
                                "Restaurant: %s\n" +
                                "Address: %s, %s\n" + //
                                "Table Number: %s\n" + //
                                "Date: %s\n" + //
                                "Time: %s - %s\n" + //
                                "Party Size: %d\n\n" + //
                                "Reservation ID: %s\n\n" + //
                                "Thank you for using BookTable!",
                        user.getName(), //
                        restaurant.getName(), //
                        restaurant.getAddressStreet(), restaurant.getAddressCity(), //
                        table.getTableNumber(), //
                        savedReservation.getDate().toString(), //
                        savedReservation.getStartSlotTime().toString(), //
                        savedReservation.getEndSlotTime().toString(), //
                        savedReservation.getPartySize(), //
                        savedReservation.getId().toHexString() //
                );

                // Send the email using the injected service
                mailjetEmailService.sendEmail(recipientEmail, subject, messageBody); //
                System.out.println("Booking confirmation email sent to " + recipientEmail);

            } else {
                // Log if user, restaurant, or table details are missing
                if (!userOpt.isPresent())
                    log.error("Could not find user with ID: {}", savedReservation.getCustomerId());
                if (!restaurantOpt.isPresent())
                    log.error("Could not find restaurant with ID: {}", savedReservation.getRestaurantId());
                if (!tableOpt.isPresent()) log.error("Could not find table with ID: {}", savedReservation.getTableId());
            }

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
        }

        return savedReservation;
    }

    @Transactional // Make cancellation transactional
    public boolean cancelReservation(ObjectId reservationId, ObjectId customerId) throws AccessDeniedException {
        log.info("Attempting to cancel reservation ID: {} for customer ID: {}", reservationId, customerId);

        // Find reservation ensuring it belongs to the customer making the request
        Reservation reservation = reservationRepository.findByIdAndCustomerId(reservationId, customerId)
                .orElseThrow(() -> {
                    // Check if reservation exists at all to differentiate errors
                    if (!reservationRepository.existsById(reservationId)) {
                        log.warn("Cancellation failed: Reservation not found with ID: {}", reservationId);
                        return new ReservationNotFoundException("Reservation not found with ID: " + reservationId);
                    } else {
                        log.warn("Cancellation denied: Reservation {} does not belong to customer {}", reservationId, customerId);
                        // Throw AccessDeniedException directly
                        return new RuntimeException(new AccessDeniedException("You are not authorized to cancel this reservation."));
                    }
                });

        // Check if already cancelled
        if (Reservation.STATUS_CANCELLED.equals(reservation.getStatus())) {
            log.info("Reservation {} already cancelled.", reservationId);
            return true; // Or throw exception if desired: throw new IllegalStateException("Reservation is already cancelled.");
        }

        // Check if cancellation is allowed based on time
        LocalDateTime reservationDateTime = LocalDateTime.of(reservation.getDate(), reservation.getStartSlotTime());
        LocalDateTime now = LocalDateTime.now(); // Use current server time
        LocalDateTime cancellationDeadline = reservationDateTime.minusHours(CANCELLATION_WINDOW_HOURS);

        if (now.isAfter(cancellationDeadline)) {
            log.warn("Cancellation failed: Reservation {} is within {} hours. Deadline was {}. Current time is {}",
                    reservationId, CANCELLATION_WINDOW_HOURS, cancellationDeadline, now);
            throw new CancellationNotAllowedException(
                    "Cancellation is not allowed within " + CANCELLATION_WINDOW_HOURS + " hours of the reservation time."
            );
        }

        // Perform the soft delete
        reservation.setStatus(Reservation.STATUS_CANCELLED);
        reservationRepository.save(reservation);
        log.info("Successfully cancelled reservation ID: {}", reservationId);
        // Optional: Send cancellation confirmation email here
        return true;
    }

    public boolean isDuplicateReservation(Reservation reservation) {
        List<Reservation> existingReservations = reservationRepository.findByRestaurantIdAndTableIdAndDateAndStartSlotTimeAndEndSlotTime(
                reservation.getRestaurantId(),
                reservation.getTableId(),
                reservation.getDate(),
                reservation.getStartSlotTime(),
                reservation.getEndSlotTime()
        );
        return !existingReservations.isEmpty();
    }

    public Set<List<Object>> getBookedTablesAndTimes(ObjectId restaurantId, LocalDate date) {
        log.debug("ReservationService: Fetching booked tables using DTO projection for Restaurant ID: {} on Date: {}", restaurantId, date);

        List<BookedTimeSlotProjection> bookedSlots = reservationRepository.findBookedTablesAndTimes(restaurantId, date);

        log.debug("ReservationService: Found {} booked slot projections from repository", bookedSlots.size());

        return bookedSlots.stream()
                .filter(dto -> dto != null && dto.getTableId() != null && dto.getStartSlotTime() != null && dto.getEndSlotTime() != null)
                .map(dto -> {
                    String tableIdStr = dto.getTableId().toHexString();
                    LocalTime startTime = dto.getStartSlotTime();
                    LocalTime endTime = dto.getEndSlotTime();
                    log.trace("Mapping booked slot: Table={}, Start={}, End={}", tableIdStr, startTime, endTime); // Optional trace log
                    return List.of(
                            tableIdStr,
                            List.of(startTime, endTime) // Create the inner list of LocalTime
                    );
                })
                .collect(Collectors.toSet());
    }


//    public Set<List<Object>> getBookedTablesAndTimes(ObjectId restaurantId, LocalDate date) {
//        log.debug("ReservationService: Fetching booked tables for Restaurant ID: {} on Date: {}", restaurantId, date); // Log input
//
//        List<Object[]> rawResults = reservationRepository.findBookedTablesAndTimes(restaurantId, date); // <-- The actual repository call
//
//        // --- Log Raw Results ---
//        if (log.isDebugEnabled()) {
//            log.debug("ReservationService: Raw results count from findBookedTablesAndTimes: {}", rawResults.size());
//            rawResults.forEach(record -> {
//                if (record != null) {
//                    log.debug("  Raw record: length={}, content={}", record.length, Arrays.toString(record));
//                } else {
//                    log.debug("  Raw record: null");
//                }
//            });
//        }
//        // --- End Log Raw Results ---
//
//        // Continue with the existing processing logic
//        return rawResults.stream()
//                // Add the filter here as well for safety before mapping
//                .filter(record -> record != null && record.length >= 3 &&
//                        record[0] != null && record[1] != null && record[2] != null &&
//                        record[1] instanceof LocalTime && record[2] instanceof LocalTime)
//                .map(record -> List.of(
//                        String.valueOf(record[0]), // tableId
//                        List.of((LocalTime) record[1], (LocalTime) record[2])) // List<LocalTime>
//                )
//                .collect(Collectors.toSet());
//    }

    public int countReservationsForDate(ObjectId restaurantId, LocalDate date) {
        Long count = reservationRepository.countByRestaurantIdAndDate(restaurantId, date);
        return count != null ? count.intValue() : 0;
    }

    public List<Reservation> getReservations(LocalDate date, LocalDate startDate, LocalDate endDate, String restaurantId, String managerId) throws AccessDeniedException {

        ObjectId restaurantObjectId = restaurantId != null ? new ObjectId(restaurantId) : null;

        // If a managerId is provided, verify they own the restaurant
        if (managerId != null && restaurantObjectId != null) {
            verifyManagerOwnership(restaurantObjectId, managerId);
        }

        if (date != null && restaurantObjectId != null) {
            return reservationRepository.findByDateAndRestaurantId(date, restaurantObjectId);
        } else if (startDate != null && endDate != null && restaurantObjectId != null) {
            return reservationRepository.findByDateBetweenAndRestaurantId(startDate, endDate, restaurantObjectId);
        } else if (startDate != null && endDate != null) {
            return reservationRepository.findByDateBetween(startDate, endDate);
        } else if (date != null) {
            return reservationRepository.findByDate(date);
        } else if (restaurantObjectId != null) {
            return reservationRepository.findByRestaurantId(restaurantObjectId);
        } else {
            return reservationRepository.findAll();
        }
    }

    public List<Reservation> getReservationsByCustomerId(ObjectId customerId) {
        return reservationRepository.findByCustomerId(customerId);
    }

    private void verifyManagerOwnership(ObjectId restaurantId, String managerId) throws AccessDeniedException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId.toHexString())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + restaurantId));

        if (!restaurant.getManagerId().equals(managerId)) {
            throw new AccessDeniedException("Manager does not own restaurant with ID: " + restaurantId);
        }
    }
}
package com.booktable.service;

import com.booktable.dto.BookedTimeSlotProjection;
import com.booktable.model.Reservation;
import com.booktable.model.Restaurant;
import com.booktable.model.Table;
import com.booktable.model.User;
import com.booktable.repository.ReservationRepository;
import com.booktable.repository.RestaurantRepository;
import com.booktable.repository.TableRepository;
import com.booktable.repository.UserRepository;
import com.booktable.service.MailjetEmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository; // Added
    private final TableRepository tableRepository;   // Added
    private final MailjetEmailService mailjetEmailService;
    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, RestaurantRepository restaurantRepository,UserRepository userRepository,
                              TableRepository tableRepository,
                              MailjetEmailService mailjetEmailService) {
        this.reservationRepository = reservationRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
        this.mailjetEmailService = mailjetEmailService;
    }

    public Reservation saveReservation(Reservation reservation) {
        // Save the reservation first
        Reservation savedReservation = reservationRepository.save(reservation);

        // --- Send Confirmation Email ---
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
                String subject = "Your Booking Confirmation at " + restaurant.getName(); //

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
                if (!userOpt.isPresent()) log.error("Could not find user with ID: {}", savedReservation.getCustomerId());
                if (!restaurantOpt.isPresent()) log.error("Could not find restaurant with ID: {}", savedReservation.getRestaurantId());
                if (!tableOpt.isPresent()) log.error("Could not find table with ID: {}", savedReservation.getTableId());
            }

        } catch (Exception e) {
            // Log the error, but don't necessarily fail the entire booking process
            log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
        }
        // --- End of Email Sending Logic ---

        return savedReservation; // Return the saved reservation object
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
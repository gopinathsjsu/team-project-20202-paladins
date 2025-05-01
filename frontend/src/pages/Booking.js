import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBookingThunk, resetBookingStatus } from '../redux/slices/bookingSlice';

import {
    Container, Typography, Box, Button, Alert, CircularProgress, Paper, Divider
} from '@mui/material';

const Booking = () => {
    const { restaurantId } = useParams();
    const location = useLocation();
    console.log("Location state:", location.state);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedSlot, restaurantDetails } = location.state || {};

    const customerId = useSelector((state) => state.auth.id) || "68129d333d1ddb0c27e83259";
    const bookingStatus = useSelector((state) => state.booking.status);
    const bookingError = useSelector((state) => state.booking.error);
    const bookingConfirmation = useSelector((state) => state.booking.confirmation);

    useEffect(() => {
        if (!selectedSlot || !restaurantDetails || !customerId) {
            console.error("Booking page missing required state or customer ID.");
            navigate('/');
        }
    }, [selectedSlot, restaurantDetails, customerId, navigate]);

    useEffect(() => {
        return () => {
            dispatch(resetBookingStatus());
        };
    }, [dispatch]);

    const handleConfirmBooking = () => {
        if (!selectedSlot || !customerId || !restaurantId) {
            console.error("Cannot proceed: Missing required booking information.");
            return;
        }

        const bookingData = {
            customerId: customerId,
            restaurantId: restaurantId,
            tableId: selectedSlot.tableId,
            startSlotTime: selectedSlot.startSlotTime,
            endSlotTime: selectedSlot.endSlotTime,
            date: selectedSlot.date
        };

        dispatch(createBookingThunk(bookingData));
    };

    if (!selectedSlot || !restaurantDetails || !customerId) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5, py: 5 }}> {/* Added padding */}
                <CircularProgress />
                <Typography sx={{ mt: 2 }} color="text.secondary"> {/* Adjusted margin/color */}
                    Loading booking details...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Confirm Your Booking
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ my: 2 }}>
                    <Typography variant="h6" gutterBottom>Restaurant:</Typography>
                    <Typography>{restaurantDetails.name}</Typography>
                    <Typography color="text.secondary">{restaurantDetails.addressStreet}, {restaurantDetails.addressCity}</Typography>

                    <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Booking Details:</Typography>
                    <Typography>Date: {selectedSlot.date}</Typography>
                    <Typography>Time: {selectedSlot.startSlotTime} - {selectedSlot.endSlotTime}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {bookingStatus === 'failed' && bookingError && <Alert severity="error" sx={{ my: 2 }}>{typeof bookingError === 'string' ? bookingError : 'Booking failed.'}</Alert>}

                {bookingStatus === 'succeeded' && bookingConfirmation ? (
                    <Alert severity="success" sx={{ my: 2 }}>
                        Booking Confirmed!
                        <br />
                        Restaurant: {bookingConfirmation.restaurantName}
                        <br />
                        Table: {bookingConfirmation.tableNumber}
                        <br />
                        Time: {bookingConfirmation.startSlotTime} - {bookingConfirmation.endSlotTime}
                        <br />
                        Date: {bookingConfirmation.date}
                        <br />
                        Reservation ID: <strong>{bookingConfirmation.reservationId}</strong>
                    </Alert>
                ) : (
                    // Show button only if not succeeded
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleConfirmBooking}
                            disabled={bookingStatus === 'loading' || bookingStatus === 'succeeded'}
                        >
                            {bookingStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Booking;
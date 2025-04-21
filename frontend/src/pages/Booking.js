import React from 'react';
import {Container, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';

const Booking = () => {
    const {restaurantId} = useParams();

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Make a Reservation
            </Typography>
            <Typography variant="body1">
                Booking form for restaurant {restaurantId} coming soon...
            </Typography>
        </Container>
    );
};

export default Booking; 
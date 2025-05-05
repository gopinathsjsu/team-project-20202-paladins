import React from 'react';
import { Container, Typography } from '@mui/material';

const UserBookings = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      <Typography variant="body1">
        A list of past and upcoming bookings will be displayed here.
      </Typography>
      {/* TODO: Fetch and display user bookings */}
    </Container>
  );
};

export default UserBookings;
import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      restaurant: 'Gourmet Kitchen',
      date: '2024-02-20',
      time: '19:00',
      partySize: 4,
      status: 'Confirmed'
    },
    {
      id: 2,
      restaurant: 'Sushi Master',
      date: '2024-02-22',
      time: '20:00',
      partySize: 2,
      status: 'Pending'
    }
  ];

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Please log in to view your bookings
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        
        {bookings.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              You don't have any bookings yet.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3}>
            <List>
              {bookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemText
                      primary={booking.restaurant}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Party of {booking.partySize} • {booking.status}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < bookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default MyBookings; 
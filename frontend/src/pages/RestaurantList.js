
import React from 'react';
import { Container, Grid, Typography, Box, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantList = () => {
  const location = useLocation();
  const { searchResults = [] } = location.state || {};
  const { searchParams } = location.state || {};
  const { date, partySize } = searchParams || {};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: '#2D2D2D', textAlign: 'center' }}
        >
          Search Results
        </Typography>

        {searchResults.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4, textAlign: 'center' }}>
            No restaurants found matching your criteria.
          </Alert>
        ) : (
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px',
              mt: 2,
            }}
          >
            {searchResults.map((result) => (
              <RestaurantCard
                key={result.restaurant.id}
                restaurant={result.restaurant}
                tableSlots={result.tableSlots}
                noOfTimesBookedToday={result.noOfTimesBookedToday}
                date={date}
                partySize={partySize}
              />
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantList;

import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Stack,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Home = () => {
  // Mock data for restaurants with availability
  const availableRestaurants = [
    {
      id: 1,
      name: 'The Gourmet Kitchen',
      cuisine: 'Italian',
      rating: 4.5,
      reviewCount: 328,
      image: 'https://source.unsplash.com/random/400x250/?restaurant,italian',
      costRating: '$$$',
      bookingsToday: 12,
      availableTimes: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM']
    },
    {
      id: 2,
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.8,
      reviewCount: 542,
      image: 'https://source.unsplash.com/random/400x250/?restaurant,japanese',
      costRating: '$$$$',
      bookingsToday: 28,
      availableTimes: ['6:00 PM', '7:30 PM', '8:30 PM']
    },
    {
      id: 3,
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.3,
      reviewCount: 245,
      image: 'https://source.unsplash.com/random/400x250/?restaurant,indian',
      costRating: '$$',
      bookingsToday: 15,
      availableTimes: ['6:30 PM', '7:00 PM', '8:00 PM']
    }
  ];

  const handleTimeSlotClick = (restaurantId, time) => {
    console.log(`Booking for restaurant ${restaurantId} at ${time}`);
    // TODO: Implement booking logic
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Hero Section */}
      <Box sx={{ 
        py: 6,
        textAlign: 'center',
        bgcolor: '#f8f9fa'
      }}>
        <Container maxWidth="xl">
          <Stack spacing={3} alignItems="center">
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                color: '#2d2d2d',
                fontWeight: 600,
                mb: 2
              }}
            >
              Find and Book the Best Restaurants
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                maxWidth: 600,
                mb: 4
              }}
            >
              Discover amazing dining experiences and reserve your table instantly
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Restaurant Results */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={3}>
          {availableRestaurants.map((restaurant) => (
            <Grid item xs={12} md={6} lg={4} key={restaurant.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.image}
                  alt={restaurant.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={2}>
                    {/* Restaurant Info */}
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {restaurant.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Chip label={restaurant.cuisine} size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.costRating}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Ratings and Bookings */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({restaurant.reviewCount})
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <TrendingUpIcon color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main">
                          {restaurant.bookingsToday} bookings today
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Available Time Slots */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Available Times:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {restaurant.availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant="outlined"
                            size="small"
                            onClick={() => handleTimeSlotClick(restaurant.id, time)}
                            sx={{ 
                              mt: 1,
                              color: '#2DD4BF',
                              borderColor: '#2DD4BF',
                              '&:hover': {
                                bgcolor: '#2DD4BF',
                                color: 'white',
                                borderColor: '#2DD4BF'
                              }
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

// Mock data for restaurants
const allRestaurants = [
  {
    id: 1,
    name: 'Gourmet Kitchen',
    cuisine: 'Italian',
    rating: 4.5,
    reviewCount: 328,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$$',
    bookingsToday: 12,
    availableTimes: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'],
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Sushi Master',
    cuisine: 'Japanese',
    rating: 4.8,
    reviewCount: 542,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$$$',
    bookingsToday: 28,
    availableTimes: ['6:00 PM', '7:30 PM', '8:30 PM'],
    location: 'Los Angeles, CA'
  },
  {
    id: 3,
    name: 'Spice Route',
    cuisine: 'Indian',
    rating: 4.3,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$',
    bookingsToday: 15,
    availableTimes: ['6:30 PM', '7:00 PM', '8:00 PM'],
    location: 'San Francisco, CA'
  },
  {
    id: 4,
    name: 'La Petite Bistro',
    cuisine: 'French',
    rating: 4.7,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$$$',
    bookingsToday: 18,
    availableTimes: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
    location: 'Chicago, IL'
  },
  {
    id: 5,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.4,
    reviewCount: 289,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$',
    bookingsToday: 22,
    availableTimes: ['5:30 PM', '6:30 PM', '7:30 PM', '8:30 PM'],
    location: 'New York, NY'
  },
  {
    id: 6,
    name: 'The Steakhouse',
    cuisine: 'American',
    rating: 4.6,
    reviewCount: 376,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    costRating: '$$$$',
    bookingsToday: 25,
    availableTimes: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
    location: 'Los Angeles, CA'
  }
];

const SearchResults = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({});
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const searchParams = {
      location: params.get('location') || '',
      date: params.get('date') || new Date().toISOString().split('T')[0],
      time: params.get('time') || '19:00',
      partySize: parseInt(params.get('partySize')) || 2,
      q: params.get('q') || ''  // Add search query parameter
    };
    setSearchParams(searchParams);

    // Filter restaurants based on search parameters
    const filtered = allRestaurants.filter(restaurant => {
      // Filter by search query if specified
      if (searchParams.q && !restaurant.name.toLowerCase().includes(searchParams.q.toLowerCase()) &&
          !restaurant.cuisine.toLowerCase().includes(searchParams.q.toLowerCase())) {
        return false;
      }

      // Filter by location if specified
      if (searchParams.location && !restaurant.location.toLowerCase().includes(searchParams.location.toLowerCase())) {
        return false;
      }

      // Filter by available times
      const searchTime = searchParams.time;
      if (!restaurant.availableTimes.includes(searchTime)) {
        return false;
      }

      return true;
    });

    setFilteredRestaurants(filtered);
  }, [location.search]);

  const handleTimeSlotClick = (restaurantId, time) => {
    console.log(`Booking for restaurant ${restaurantId} at ${time}`);
    // TODO: Implement booking logic
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Search Results Header */}
      <Box sx={{ 
        py: 4,
        textAlign: 'center',
        bgcolor: '#f8f9fa'
      }}>
        <Container maxWidth="xl">
          <Stack spacing={2} alignItems="center">
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                color: '#2d2d2d',
                fontWeight: 600
              }}
            >
              Search Results
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#666',
                maxWidth: 600
              }}
            >
              {filteredRestaurants.length} restaurants found for {searchParams.location || 'your location'} on {searchParams.date} at {searchParams.time}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Restaurant Results */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        {filteredRestaurants.length > 0 ? (
          <>
            {/* First Row */}
            <Grid container spacing={4} sx={{ 
              justifyContent: 'center',
              display: 'flex',
              flexWrap: 'nowrap',
              mb: 4
            }}>
              {filteredRestaurants.slice(0, 3).map((restaurant) => (
                <Grid item xs={4} key={restaurant.id} sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  flex: '1 1 33.33%'
                }}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: 400,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={restaurant.image}
                      alt={restaurant.name}
                      sx={{
                        objectFit: 'cover'
                      }}
                    />
                    <CardContent sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3
                    }}>
                      <Stack spacing={2}>
                        {/* Restaurant Info */}
                        <Box>
                          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                            {restaurant.name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Chip 
                              label={restaurant.cuisine} 
                              size="small" 
                              sx={{ 
                                bgcolor: '#2DD4BF',
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
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

            {/* Second Row */}
            {filteredRestaurants.length > 3 && (
              <Grid container spacing={4} sx={{ 
                justifyContent: 'center',
                display: 'flex',
                flexWrap: 'nowrap'
              }}>
                {filteredRestaurants.slice(3, 6).map((restaurant) => (
                  <Grid item xs={4} key={restaurant.id} sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    flex: '1 1 33.33%'
                  }}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: '100%',
                      maxWidth: 400,
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={restaurant.image}
                        alt={restaurant.name}
                        sx={{
                          objectFit: 'cover'
                        }}
                      />
                      <CardContent sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3
                      }}>
                        <Stack spacing={2}>
                          {/* Restaurant Info */}
                          <Box>
                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                              {restaurant.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                              <Chip 
                                label={restaurant.cuisine} 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#2DD4BF',
                                  color: 'white',
                                  fontWeight: 500
                                }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
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
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No restaurants found matching your search criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults; 
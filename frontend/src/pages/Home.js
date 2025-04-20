import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation } from 'react-router-dom';
import { getS3ImageUrl } from '../utils/s3Utils';

const Home = () => {
  const location = useLocation();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartySize, setSelectedPartySize] = useState(2);

  const availableRestaurants = useMemo(() => [
    {
      id: 1,
      name: 'Gourmet Kitchen',
      cuisine: 'International',
      rating: 4.5,
      priceRange: '$$$',
      image: getS3ImageUrl('restaurants/gourmet-kitchen.jpg'),
      location: 'Downtown',
      description: 'Experience world-class cuisine in an elegant setting.'
    },
    {
      id: 2,
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.8,
      priceRange: '$$$$',
      image: getS3ImageUrl('restaurants/sushi-master.jpg'),
      location: 'Waterfront',
      description: 'Authentic Japanese sushi crafted by master chefs.'
    },
    {
      id: 3,
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.3,
      priceRange: '$$',
      image: getS3ImageUrl('restaurants/spice-route.jpg'),
      location: 'Midtown',
      description: 'A journey through the rich flavors of Indian cuisine.'
    }
  ], []); // Empty dependency array since this is static data

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const newSearchParams = {
      q: params.get('q') || '',
      location: params.get('location') || ''
    };

    // If we're at the root path with no query, show all restaurants
    if (location.pathname === '/' && !newSearchParams.q && !newSearchParams.location) {
      setFilteredRestaurants(availableRestaurants);
      return;
    }

    // Filter restaurants based on search query
    let filtered = [...availableRestaurants];

    // Only filter if there's a search query
    if (newSearchParams.q && newSearchParams.q.trim() !== '') {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(newSearchParams.q.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(newSearchParams.q.toLowerCase())
      );
    }

    // Filter by location if specified
    if (newSearchParams.location && newSearchParams.location.trim() !== '') {
      filtered = filtered.filter(restaurant => 
        restaurant.location.toLowerCase().includes(newSearchParams.location.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  }, [location.search, location.pathname, availableRestaurants]);

  // Listen for search updates from the header
  useEffect(() => {
    const handleSearchUpdate = (event) => {
      const { searchParams } = event.detail;
      const queryParams = new URLSearchParams();
      if (searchParams.q) queryParams.append('q', searchParams.q);
      if (searchParams.location) queryParams.append('location', searchParams.location);

      // Update URL without navigation
      window.history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);
      
      // Update filtered restaurants immediately
      let filtered = [...availableRestaurants];
      
      // Filter by search query if specified
      if (searchParams.q && searchParams.q.trim() !== '') {
        filtered = filtered.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchParams.q.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchParams.q.toLowerCase())
        );
      }

      // Filter by location if specified
      if (searchParams.location && searchParams.location.trim() !== '') {
        filtered = filtered.filter(restaurant => 
          restaurant.location.toLowerCase().includes(searchParams.location.toLowerCase())
        );
      }

      setFilteredRestaurants(filtered);
    };

    window.addEventListener('searchUpdated', handleSearchUpdate);
    return () => window.removeEventListener('searchUpdated', handleSearchUpdate);
  }, [location.pathname, availableRestaurants]);

  // Initialize with all restaurants
  useEffect(() => {
    setFilteredRestaurants(availableRestaurants);
  }, [availableRestaurants]);

  const handleTimeSlotClick = (restaurantId, time) => {
    const restaurant = availableRestaurants.find(r => r.id === restaurantId);
    setSelectedRestaurant(restaurant);
    setSelectedTimeSlot(time);
    setOpenDialog(true);
  };

  const handlePartySizeChange = (event) => {
    const newSize = event.target.value;
    setSelectedPartySize(newSize);
    // Update URL with new party size
    const params = new URLSearchParams(location.search);
    params.set('partySize', newSize);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const handleConfirmBooking = () => {
    // Here you would typically make an API call to book the reservation
    console.log(`Confirmed booking for ${selectedRestaurant.name} at ${selectedTimeSlot} for ${selectedPartySize} people`);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTimeSlot(null);
    setSelectedRestaurant(null);
  };

  const displayRestaurants = filteredRestaurants.length > 0 ? filteredRestaurants : availableRestaurants;

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
        {/* First Row */}
        <Grid container spacing={4} sx={{ 
          justifyContent: 'center',
          display: 'flex',
          flexWrap: 'nowrap',
          mb: 4
        }}>
          {displayRestaurants.slice(0, 3).map((restaurant) => (
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
                          {restaurant.priceRange}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Location */}
                    <Box>
                      <Button
                        startIcon={<LocationOnIcon />}
                        endIcon={<OpenInNewIcon />}
                        href={restaurant.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#2DD4BF',
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          p: 0
                        }}
                      >
                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                          {restaurant.address}
                        </Typography>
                      </Button>
                    </Box>

                    {/* Ratings and Bookings */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating 
                            value={restaurant.rating} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
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

                    {/* Reviews Preview */}
                    {restaurant.reviews && restaurant.reviews.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          Recent Reviews:
                        </Typography>
                        <Stack spacing={1}>
                          {restaurant.reviews.slice(0, 2).map((review, index) => (
                            <Box key={index} sx={{ 
                              bgcolor: 'rgba(45, 212, 191, 0.1)',
                              p: 1,
                              borderRadius: 1
                            }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {review.author}
                                </Typography>
                                <Rating 
                                  value={review.rating} 
                                  readOnly 
                                  size="small"
                                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                {review.text}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

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
        <Grid container spacing={4} sx={{ 
          justifyContent: 'center',
          display: 'flex',
          flexWrap: 'nowrap'
        }}>
          {displayRestaurants.slice(3, 6).map((restaurant) => (
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
                          {restaurant.priceRange}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Location */}
                    <Box>
                      <Button
                        startIcon={<LocationOnIcon />}
                        endIcon={<OpenInNewIcon />}
                        href={restaurant.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#2DD4BF',
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          p: 0
                        }}
                      >
                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                          {restaurant.address}
                        </Typography>
                      </Button>
                    </Box>

                    {/* Ratings and Bookings */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating 
                            value={restaurant.rating} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
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
      </Container>

      {/* Booking Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="booking-dialog-title"
        aria-describedby="booking-dialog-description"
      >
        <DialogTitle id="booking-dialog-title">
          Confirm Your Reservation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="booking-dialog-description">
            {selectedRestaurant && (
              <Stack spacing={2}>
                <Typography variant="h6" component="div">
                  {selectedRestaurant.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    label={selectedRestaurant.cuisine} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#2DD4BF',
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {selectedRestaurant.priceRange}
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="body1">
                    Time: {selectedTimeSlot}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedPartySize}
                      onChange={handlePartySizeChange}
                      startAdornment={
                        <PeopleIcon sx={{ color: '#2DD4BF', mr: 1 }} />
                      }
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? 'Person' : 'People'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmBooking} 
            variant="contained"
            sx={{ 
              bgcolor: '#2DD4BF',
              '&:hover': {
                bgcolor: '#14B8A6'
              }
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home; 
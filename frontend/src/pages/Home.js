import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleIcon from '@mui/icons-material/People';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({
    q: '',
    location: ''
  });
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPartySize, setSelectedPartySize] = useState(2);

  // Mock data for restaurants with availability and operating hours
  const availableRestaurants = [
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
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      address: '123 Main St, San Jose, CA 95112',
      googleMapsUrl: 'https://goo.gl/maps/example1',
      reviews: [
        { author: 'John D.', rating: 5, text: 'Amazing food and service!' },
        { author: 'Sarah M.', rating: 4, text: 'Great atmosphere and delicious pasta.' }
      ]
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
      operatingHours: {
        monday: { open: '11:30', close: '22:30' },
        tuesday: { open: '11:30', close: '22:30' },
        wednesday: { open: '11:30', close: '22:30' },
        thursday: { open: '11:30', close: '22:30' },
        friday: { open: '11:30', close: '23:30' },
        saturday: { open: '11:00', close: '23:30' },
        sunday: { open: '11:00', close: '22:30' }
      },
      address: '456 Market St, San Jose, CA 95113',
      googleMapsUrl: 'https://goo.gl/maps/example2',
      reviews: [
        { author: 'Mike T.', rating: 5, text: 'Best sushi in town! Fresh and authentic.' },
        { author: 'Lisa K.', rating: 4, text: 'Beautiful presentation and great service.' }
      ]
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
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      address: '789 Santa Clara St, San Jose, CA 95110',
      googleMapsUrl: 'https://goo.gl/maps/example3',
      reviews: [
        { author: 'David R.', rating: 5, text: 'Authentic flavors and generous portions.' },
        { author: 'Emma S.', rating: 4, text: 'Great vegetarian options and friendly staff.' }
      ]
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
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      address: '321 Almaden Blvd, San Jose, CA 95110',
      googleMapsUrl: 'https://goo.gl/maps/example4',
      reviews: [
        { author: 'James W.', rating: 5, text: 'Exquisite French cuisine and perfect wine pairings.' },
        { author: 'Sophie L.', rating: 4, text: 'Romantic atmosphere and attentive service.' }
      ]
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
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      address: '654 San Carlos St, San Jose, CA 95128',
      googleMapsUrl: 'https://goo.gl/maps/example5',
      reviews: [
        { author: 'Carlos M.', rating: 5, text: 'Authentic Mexican flavors and great margaritas!' },
        { author: 'Maria G.', rating: 4, text: 'Lively atmosphere and delicious street tacos.' }
      ]
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
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      address: '987 Stevens Creek Blvd, San Jose, CA 95129',
      googleMapsUrl: 'https://goo.gl/maps/example6',
      reviews: [
        { author: 'Robert H.', rating: 5, text: 'Perfectly cooked steaks and extensive wine list.' },
        { author: 'Jennifer K.', rating: 4, text: 'Elegant dining experience with excellent service.' }
      ]
    }
  ];

  // Helper function to check if a restaurant is open at a given time
  const isRestaurantOpen = (restaurant, date, time) => {
    if (!date || !time) return true; // If no date/time specified, show all restaurants

    // Parse the date string (YYYY-MM-DD format)
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // month is 0-based in JS Date

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = dateObj.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dayOfWeek];

    // Get operating hours for the day
    const operatingHours = restaurant.operatingHours[dayName];
    if (!operatingHours) return false; // Restaurant is closed on this day

    // Parse time (HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Check if current time is within operating hours
    return timeInMinutes >= operatingHours.open && timeInMinutes <= operatingHours.close;
  };

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const newSearchParams = {
      q: params.get('q') || '',
      location: params.get('location') || ''
    };
    setSearchParams(newSearchParams);

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
  }, [location.search, location.pathname]);

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
  }, [location.pathname]);

  // Initialize with all restaurants
  useEffect(() => {
    setFilteredRestaurants(availableRestaurants);
  }, []);

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
                          {restaurant.costRating}
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
                          {restaurant.costRating}
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
                    {selectedRestaurant.costRating}
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
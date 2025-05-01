import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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
        const FIXED_RESTAURANT_ID = '68096e772b6a1c555010a44f';
        const fixedBookingData = {
            selectedSlot: {
                restaurantId: FIXED_RESTAURANT_ID,
                tableId: '68096e772b6a1c555010a451', // Fixed table ID
                startSlotTime: '18:30:00',       // Fixed start time "HH:MM:SS"
                endSlotTime: '19:30:00',         // Fixed end time "HH:MM:SS"
                date: '2025-11-01'               // Fixed date "YYYY-MM-DD"
            },
            restaurantDetails: {
                id: FIXED_RESTAURANT_ID,
                name: "Mo:mo",
                addressStreet: "123 Summit Ave",
                addressCity: "Boulder Creek",
                imageUrl: "data:image/jpeg;base64,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"
            }
        };

        console.log(`Navigating to /booking/${FIXED_RESTAURANT_ID} with fixed static data.`);
        console.log("Passing fixed state:", fixedBookingData);

        // Navigate always to the same booking URL with the same fixed state data
        navigate(
            `/booking/${FIXED_RESTAURANT_ID}`, // Use the fixed ID in the URL path
            {
                state: fixedBookingData // Pass the entire fixed data object
            }
        );
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
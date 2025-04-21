import React from 'react';
import {Box, Card, CardContent, CardMedia, Chip, Rating, Stack, Typography, useTheme} from '@mui/material';

const RestaurantCard = ({restaurant}) => {
    const theme = useTheme();
    const {name, cuisine, rating, image, cost, bookingsToday} = restaurant;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={name}
            />
            <CardContent sx={{flexGrow: 1}}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{fontFamily: 'Poppins, sans-serif'}}
                >
                    {name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{mb: 1}}>
                    <Chip
                        label={cuisine}
                        size="small"
                        sx={{fontFamily: 'Poppins, sans-serif'}}
                    />
                    <Chip
                        label={cost}
                        size="small"
                        color="primary"
                        sx={{fontFamily: 'Poppins, sans-serif'}}
                    />
                </Stack>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <Rating value={rating} precision={0.5} readOnly/>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ml: 1, fontFamily: 'Poppins, sans-serif'}}
                    >
                        ({rating})
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{fontFamily: 'Poppins, sans-serif'}}
                >
                    {bookingsToday} bookings today
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RestaurantCard; 
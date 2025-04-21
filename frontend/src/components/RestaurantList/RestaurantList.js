import React from 'react';
import {Container, Grid, Typography} from '@mui/material';
import RestaurantCard from '../RestaurantCard/RestaurantCard';

const RestaurantList = ({title, restaurants}) => {
    return (
        <Container maxWidth="lg" sx={{py: 8}}>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    mb: 4
                }}
            >
                {title}
            </Typography>
            <Grid container spacing={4}>
                {restaurants.map((restaurant) => (
                    <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                        <RestaurantCard restaurant={restaurant}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RestaurantList; 
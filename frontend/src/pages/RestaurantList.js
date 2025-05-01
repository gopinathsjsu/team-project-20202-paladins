
import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard/RestaurantCard';

const RestaurantList = () => {
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] }; // Safely access searchResults

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Search Results
            </Typography>
            {searchResults.length > 0 ? (
                <Grid container spacing={4}>
                    {searchResults.map((restaurant) => (
                        <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                            <RestaurantCard restaurant={restaurant} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No restaurants found matching your criteria.</Typography>
            )}
        </Container>
    );
};

export default RestaurantList;

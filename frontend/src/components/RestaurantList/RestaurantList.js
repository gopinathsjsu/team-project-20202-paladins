// src/pages/RestaurantList.js
import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard/RestaurantCard';

const RestaurantList = () => {
    /* —— pull the array you pushed via navigate() —— */
    const location = useLocation();
    const { searchResults = [] } = location.state || {};

    /* —— quick dev sanity check —— */
    if (process.env.NODE_ENV === 'development')
        console.log('RestaurantList → searchResults', searchResults);

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Search Results
            </Typography>

            {searchResults.length === 0 ? (
                <Typography>No restaurants found.</Typography>
            ) : (
                <Grid container spacing={4}>
                    {searchResults.map((hit) => {
                        // Accept both possible shapes
                        const isFlat      = !hit.restaurant;
                        const restaurant  = isFlat ? hit : hit.restaurant;
                        const tableSlots  = isFlat ? []  : hit.tableSlots;

                        // id can be “id” or “_id” depending on your DB/DTO
                        const key = restaurant.id ?? restaurant._id;

                        return (
                            <Grid item key={key} xs={12} sm={6} md={4}>
                                <RestaurantCard restaurant={restaurant} tableSlots={tableSlots} />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Container>
    );
};

export default RestaurantList;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';

import Search from '../components/Search';
import { searchRestaurant } from '../api/restaurant';
import RestaurantCard from '../components/RestaurantCard/RestaurantCard';

const Home = () => {
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchRestaurant(params);
      navigate("/restaurants", { state: { searchResults: results } });
    } catch (err) {
      console.error("Search failed:", err);
      setError("Could not load search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Search Restaurants
          </Typography>

          <Search onSearch={handleSearch} />

          {loading && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>Loading results...</Typography>
              </Box>
          )}

          {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
          )}

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {filteredRestaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant.id || restaurant._id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  );
};

export default Home;
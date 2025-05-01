import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Rating,
  Stack,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import API from "../api/API";
import {API_ENDPOINTS} from "../constants/api";
import {formatTime} from "../utils/dateUtils";
import {useSearchParams} from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import api from "../services/api";  // Import axios instance

const Home = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedTime, setSelectedTime] = useState(
      new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching all restaurants from:", API_ENDPOINTS.RESTAURANTS.LIST);
        const response = await api.get(API_ENDPOINTS.RESTAURANTS.LIST);  // Use api (axios instance)
        console.log("Response from API:", response.data);
        setAllRestaurants(response.data);
        setFilteredRestaurants(response.data); // Initially show all
      } catch (error) {
        console.error("Error fetching all restaurants:", error);
        setError("Could not load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  const handleTimeChange = async (event) => {
    const time = event.target.value;
    setSelectedTime(time);

    try {
      console.log("Filtering restaurants by time:", time);
      const response = await api.get(API_ENDPOINTS.RESTAURANTS.SEARCH, {  // Use api (axios instance)
        params: {
          startTime: time
        }
      });
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error("Error filtering restaurants by time:", error);
      setError("Could not filter restaurants by time.");
    }
  };

  if (loading) {
    return (
        <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh'
            }}
        >
          <CircularProgress/>
          <Typography variant="h6" gutterBottom>
            Loading Restaurants...
          </Typography>
        </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
      <Box sx={{minHeight: '100vh', bgcolor: 'white'}}>
        <Container maxWidth="xl" sx={{py: 6}}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h3" component="h1" sx={{color: '#2d2d2d', fontWeight: 600, mb: 2}}>
              Find and Book the Best Restaurants
            </Typography>
            <Typography variant="h6" sx={{color: '#666', maxWidth: 600, mb: 4}}>
              Discover amazing dining experiences and reserve your table instantly
            </Typography>
          </Stack>
        </Container>

        <Container maxWidth="lg" sx={{py: 8}}>

          <Grid container spacing={4}>
            {filteredRestaurants.map(restaurant => (
                <Grid item xs={12} md={6} lg={4} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  );
};

export default Home;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../redux/slices/restaurantSlice";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import RestaurantCard from "../components/RestaurantCard";
import { Link } from "react-router-dom";
import { RESTAURANTS_TO_DISPLAY_HOME_PAGE } from "../constants";

const Home = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, loading]);

  if (loading === "pending") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading === "failed") {
    return (
      <Alert severity="error" sx={{ mt: 8, textAlign: "center" }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
        {/* Hero Section */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, color: "#2D2D2D", textAlign: "center" }}
        >
          Available Restaurants
        </Typography>

        {/* Restaurant Cards Section */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {restaurants.slice(0, RESTAURANTS_TO_DISPLAY_HOME_PAGE).map((restaurant) => (
            <Grid item key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </Grid>
          ))}
        </Grid>

        {/* "View All" Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link to="/restaurants">
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "30px",
                px: 4,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              View All
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

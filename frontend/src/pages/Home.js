import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import Search from "../components/Search";
import { searchRestaurant } from "../api/restaurant";
import { Link } from "react-router-dom";
import { RESTAURANTS_TO_DISPLAY_HOME_PAGE } from "../constants";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading: reduxLoading, error: reduxError } = useSelector(
      (state) => state.restaurants
  );

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (reduxLoading === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, reduxLoading]);

  const handleSearch = async (params) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const results = await searchRestaurant(params);
      navigate("/restaurants", { state: { searchResults: results } });
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Could not load search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        <Container maxWidth="lg" sx={{ pt: 6 }}>
          <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: "#2D2D2D", textAlign: "center" }}
          >
            Search Restaurants
          </Typography>

          <Search onSearch={handleSearch} />

          {searchLoading && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>Searching...</Typography>
              </Box>
          )}

          {searchError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {searchError}
              </Alert>
          )}
        </Container>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
          <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600, color: "#2D2D2D", textAlign: "center" }}
          >
            Available Restaurants
          </Typography>

          {reduxLoading === "pending" ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
          ) : reduxLoading === "failed" ? (
              <Alert severity="error" sx={{ mt: 4, textAlign: "center" }}>
                {reduxError}
              </Alert>
          ) : (
              <>
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
                  {restaurants
                      .slice(0, RESTAURANTS_TO_DISPLAY_HOME_PAGE)
                      .map((restaurant) => (
                          <Grid item key={restaurant.id}>
                            <RestaurantCard restaurant={restaurant} />
                          </Grid>
                      ))}
                </Grid>

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
              </>
          )}
        </Container>
      </Box>
  );
};

export default Home;
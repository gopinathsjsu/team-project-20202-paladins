import React, {useEffect, useState} from "react";
import {useDispatch, useSelector, useSelector as useReduxSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {fetchRestaurants} from "../redux/slices/restaurantSlice";
import {Alert, Box, Button, CircularProgress, Container, Grid, Typography,} from "@mui/material";
import RestaurantCard from "../components/RestaurantCard";
import Search from "../components/Search";
import {RESTAURANTS_TO_DISPLAY_HOME_PAGE} from "../constants";
import {searchRestaurant} from "../api/restaurant";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {restaurants, loading: reduxLoading, error: reduxError} = useSelector(
    (state) => state.restaurants
  );

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (reduxLoading === "idle") {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, reduxLoading]);

  const location = useReduxSelector((state) => state.search.location);
  const handleSearch = async (params) => {
    setSearchLoading(true);
    setSearchError(null);
    if (location) {
      const [city, stateCode] = location.split(", ").map((loc) => loc.trim());
      params.city = city;
      params.state = stateCode;
    }
    try {
      const results = await searchRestaurant(params);
      navigate("/restaurants", {state: {searchResults: results, searchParams: params}});
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Could not load search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Box sx={{minHeight: "100vh", bgcolor: "#f8f9fa"}}>
      <Container maxWidth="lg" sx={{pt: 6}}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{fontWeight: 600, color: "#2D2D2D", textAlign: "center"}}
        >
          Search Restaurants
        </Typography>

        <Search onSearch={handleSearch}/>

        {searchLoading && (
          <Box sx={{textAlign: "center", mt: 2}}>
            <CircularProgress/>
            <Typography sx={{mt: 1}}>Searching...</Typography>
          </Box>
        )}

        {searchError && (
          <Alert severity="error" sx={{mt: 2}}>
            {searchError}
          </Alert>
        )}
      </Container>

      <Container maxWidth="xl" sx={{mt: 4, mb: 8}}>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{fontWeight: 600, color: "#2D2D2D", textAlign: "center"}}
        >
          Available Restaurants
        </Typography>

        {reduxLoading === "pending" ? (
          <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
            <CircularProgress/>
          </Box>
        ) : reduxLoading === "failed" ? (
          <Alert severity="error" sx={{mt: 4, textAlign: "center"}}>
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
                  <RestaurantCard key={restaurant.id} restaurant={restaurant}/>
                ))}
            </Grid>


            <Box sx={{textAlign: "center", mt: 4}}>
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
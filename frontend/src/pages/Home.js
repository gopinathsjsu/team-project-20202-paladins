import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import RestaurantCard from "../components/RestaurantCard";
import Search from "../components/Search";
import { RESTAURANTS_TO_DISPLAY_HOME_PAGE, RESTAURANTS_INCREMENT_COUNT } from "../constants";
import { searchRestaurant, deleteRestaurantByIdApi } from "../api/restaurant";
import { useSelector as useReduxSelector, useSelector as useAuthSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    restaurants: allRestaurantsFromStore,
    loading: reduxLoading,
    error: reduxError,
  } = useReduxSelector((state) => state.restaurants);
  const { role } = useAuthSelector((state) => state.auth);
  const { city: cityFromStore, zip: zipFromStore, state: stateFromStore } = useReduxSelector((state) => state.search);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State for dialogs and snackbar
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [visibleRestaurantsCount, setVisibleRestaurantsCount] = useState(RESTAURANTS_TO_DISPLAY_HOME_PAGE);

  useEffect(() => {
    if (reduxLoading === "idle" && (!allRestaurantsFromStore || allRestaurantsFromStore.length === 0)) {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, reduxLoading, allRestaurantsFromStore]);

  useEffect(() => {
    setVisibleRestaurantsCount(RESTAURANTS_TO_DISPLAY_HOME_PAGE);
  }, [allRestaurantsFromStore]);

  const approvedRestaurants = React.useMemo(() => {
    if (!Array.isArray(allRestaurantsFromStore)) return [];
    if (role === 'ADMIN') {
        return allRestaurantsFromStore;
    }
    return allRestaurantsFromStore.filter(restaurant => restaurant.approved === true);
  }, [allRestaurantsFromStore, role]);

  const handleSearch = async (paramsFromSearchBar) => {
    setSearchLoading(true);
    setSearchError(null);

    const finalSearchParams = { ...paramsFromSearchBar }; 

    // Read city, zip, AND state from Redux store and add to params
    if (cityFromStore) finalSearchParams.city = cityFromStore;
    if (stateFromStore) finalSearchParams.state = stateFromStore;
    if (zipFromStore) finalSearchParams.zip = zipFromStore;

    try {
      console.log("Searching with combined params:", finalSearchParams); 
      const results = await searchRestaurant(finalSearchParams);
      navigate("/restaurants", { state: { searchResults: results, searchParams: finalSearchParams } });
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Could not load search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Renamed from handleDeleteRestaurant to initiate the confirm dialog
  const initiateDeleteRestaurant = (restaurantId, restaurantName) => {
    setRestaurantToDelete({ id: restaurantId, name: restaurantName });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      await deleteRestaurantByIdApi(restaurantToDelete.id);
      setSnackbarMessage(`Restaurant "${restaurantToDelete.name}" deleted successfully!`);
      setSnackbarSeverity("success");
      dispatch(fetchRestaurants());
      
     

    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete restaurant.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } finally {
      setConfirmOpen(false);
      setSnackbarOpen(true);
      setRestaurantToDelete(null);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmOpen(false);
    setRestaurantToDelete(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLoadMore = () => {
    setVisibleRestaurantsCount(prevCount => Math.min(prevCount + (RESTAURANTS_INCREMENT_COUNT || 4), approvedRestaurants.length));
  };

  const initialLoading = reduxLoading === 'pending' && (!allRestaurantsFromStore || allRestaurantsFromStore.length === 0);

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

          {initialLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
          ) : reduxLoading === 'failed' && (!allRestaurantsFromStore || allRestaurantsFromStore.length === 0) ? (
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
                   {Array.isArray(approvedRestaurants) && approvedRestaurants.length > 0 ? (
                    approvedRestaurants.slice(0, visibleRestaurantsCount).map((restaurant) => (
                          <Grid item key={restaurant.id} xs={12} sm={6} md={4} lg={3}>
                            <RestaurantCard
                                restaurant={restaurant}
                                isAdmin={role === 'ADMIN'}
                                onGenericDeleteClick={() => initiateDeleteRestaurant(restaurant.id, restaurant.name)} 
                                onCardClick={() => navigate(`/restaurants/${restaurant.id}`)}
                                userRole={role}
                            />
                          </Grid>
                      ))
                  ) : reduxLoading !== 'pending' && (
                    <Typography textAlign="center" sx={{ mt: 4 }}>
                      No approved restaurants to display.
                    </Typography>
                  )}
                </Grid>

                {Array.isArray(approvedRestaurants) && visibleRestaurantsCount < approvedRestaurants.length && (
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoadMore}
                        sx={{
                          borderRadius: "30px",
                          px: 4,
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                    >
                      Load More Restaurants
                    </Button>
                  </Box>
                )}
              </>
          )}
        </Container>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the restaurant "{restaurantToDelete?.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000} // Hide after 6 seconds

          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default Home;
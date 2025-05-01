import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchManagerRestaurants } from "../../redux/slices/managerSlice";
import { Card, Typography, Button, Box, Grid, CircularProgress, Pagination } from "@mui/material";
import RestaurantCard from "../../components/RestaurantCard";
import { RESTAURANTS_PER_PAGE } from "../../constants";
import CreateRestaurantModal from "./CreateRestaurant";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.manager);
  
  const [page, setPage] = useState(1);
  const restaurantsPerPage = RESTAURANTS_PER_PAGE;

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Fetch manager's restaurants on mount
  useEffect(() => {
    dispatch(fetchManagerRestaurants());
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate the range of restaurants to display
  const startIndex = (page - 1) * restaurantsPerPage;
  const endIndex = startIndex + restaurantsPerPage;
  const currentRestaurants = restaurants.slice(startIndex, endIndex);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: "20px" }}>
      {/* My Restaurants Section */}
      <Typography variant="h5" gutterBottom>My Restaurants</Typography>
      
      {/* Create New Restaurant Button */}
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 3 }}>
        Create New Restaurant
      </Button>

      {/* Restaurant Cards Section */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Flexible grid
          gap: "16px",
        }}
      >
        {currentRestaurants.length === 0 ? (
          <Typography variant="body1">You haven't added any restaurants yet. Click the button above to create one.</Typography>
        ) : (
          currentRestaurants.map((restaurant) => (
            <Grid item key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} userRole="RESTAURANT_MANAGER" />
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(restaurants.length / restaurantsPerPage)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box>

      {/* Reservations Section */}
      <Box sx={{ marginTop: 4 }}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6">Upcoming Reservations</Typography>
          {/* Display upcoming reservations */}
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            No upcoming reservations yet.
          </Typography>
        </Card>
      </Box>

      {/* Recent Reviews Section */}
      <Box sx={{ marginTop: 4 }}>
        <Card sx={{ padding: 2 }}>
          <Typography variant="h6">Recent Reviews</Typography>
          {/* Display recent reviews */}
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            No reviews available.
          </Typography>
        </Card>
      </Box>

      {/* Create Restaurant Modal */}
      <CreateRestaurantModal open={openModal} handleClose={handleCloseModal} />
    </Box>
  );
};

export default ManagerDashboard;

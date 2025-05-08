import React, { useEffect } from 'react';
import {
  fetchPendingRestaurants,
  approveRestaurantThunk,
  deleteRestaurantThunk
} from '../../redux/slices/adminSlice';
import {
  Container, Typography, Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import RestaurantCard from '../../components/RestaurantCard';
import AnalyticsDashboard from "./AnalyticsDashboard"; // Import the RestaurantCard


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingRestaurants, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchPendingRestaurants());
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pending Restaurant Approvals
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : pendingRestaurants.length === 0 ? (
        <Typography>No pending restaurants.</Typography>
      ) : (
        <Grid container spacing={2}>
          {pendingRestaurants.map((res) => (
            <Grid item xs={12} md={6} lg={4} key={res.id}>
              {/* Use the RestaurantCard for each restaurant */}
              <RestaurantCard 
                restaurant={res} 
                userRole="ADMIN" 
                // Passing the admin specific buttons to RestaurantCard component
                approveRestaurant={() => dispatch(approveRestaurantThunk(res.id))}
                deleteRestaurant={() => dispatch(deleteRestaurantThunk(res.id))}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <AnalyticsDashboard />

    </Container>
  );
};

export default AdminDashboard;

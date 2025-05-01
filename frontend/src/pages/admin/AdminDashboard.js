import React, { useEffect } from 'react';
import {
  fetchPendingRestaurants,
  approveRestaurantThunk,
  deleteRestaurantThunk
} from '../../redux/slices/adminSlice';
import {
  Container, Typography, Card, CardContent, Button, Grid, Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

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
              <Card>
                <CardContent>
                  <Typography variant="h6">{res.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {res.addressStreet}, {res.addressCity}, {res.addressState} {res.addressZip}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => dispatch(approveRestaurantThunk(res.id))}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => dispatch(deleteRestaurantThunk(res.id))}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminDashboard;

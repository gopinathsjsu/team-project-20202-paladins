import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to BookTable
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your go-to platform for finding and booking tables at your favorite restaurants.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/restaurants')}
            sx={{ mr: 2 }}
          >
            Find Restaurants
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 
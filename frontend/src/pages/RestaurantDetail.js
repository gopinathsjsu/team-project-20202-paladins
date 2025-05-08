import React from 'react';
import {Container, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';

const RestaurantDetail = () => {
  const {id} = useParams();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Restaurant Details
      </Typography>
      <Typography variant="body1">
        Details for restaurant {id} coming soon...
      </Typography>
    </Container>
  );
};

export default RestaurantDetail; 
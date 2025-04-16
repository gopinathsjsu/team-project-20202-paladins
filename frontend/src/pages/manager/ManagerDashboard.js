import React from 'react';
import { Container, Typography } from '@mui/material';

const ManagerDashboard = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>
      <Typography>
        Welcome, Restaurant Manager. You can manage your listings here.
      </Typography>
    </Container>
  );
};

export default ManagerDashboard;

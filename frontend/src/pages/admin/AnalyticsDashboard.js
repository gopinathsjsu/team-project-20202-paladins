import React from 'react';
import { Container, Typography } from '@mui/material';

const AnalyticsDashboard = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        Welcome, Admin. This is your dashboard.
      </Typography>
    </Container>
  );
};

export default AnalyticsDashboard;

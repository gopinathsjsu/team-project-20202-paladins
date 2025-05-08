import React from 'react';
import {Container, Typography} from '@mui/material';

const UserProfile = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1">
        Profile details will be displayed here.
      </Typography>
      {/* TODO: Fetch and display user details */}
    </Container>
  );
};

export default UserProfile;
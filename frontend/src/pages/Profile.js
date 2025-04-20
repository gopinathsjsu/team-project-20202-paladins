import React from 'react';
import { Container, Typography, Box, Paper, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 3 }}
              alt={user?.name || 'User'}
            />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email || 'No email provided'}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography variant="body1" paragraph>
            Email: {user?.email || 'No email provided'}
          </Typography>
          <Typography variant="body1" paragraph>
            Member since: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 
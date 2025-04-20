import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to BookTable
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleLogin}
            sx={{ mt: 3, mb: 2 }}
            fullWidth
          >
            Sign in with Google
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ color: 'inherit' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: 'inherit' }}>
              Privacy Policy
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 
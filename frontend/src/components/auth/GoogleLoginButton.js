import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const backendUrl = process.env.REACT_APP_API_BASE_URL || '';

const GoogleLoginButton = ({ label = 'Continue with Google' }) => {
  const handleClick = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleClick}
      startIcon={<GoogleIcon sx={{ color: '#4285F4' }} />}
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        color: '#444',
        borderColor: '#ccc',
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#f7f7f7',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default GoogleLoginButton;

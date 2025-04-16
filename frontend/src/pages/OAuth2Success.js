import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { Box, CircularProgress, Typography } from '@mui/material';


const OAuth2Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');
    const role = query.get('role');

    if (token && email && role) {
      // Save to Redux and localStorage
      dispatch(login({ token, email, role }));
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'RESTAURANT_MANAGER') navigate('/manager/dashboard');
      else navigate('/');
    } else {
      navigate('/login'); // fallback
    }
  }, [dispatch, location, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Logging you in with Google...
      </Typography>
    </Box>
  );
  
};

export default OAuth2Success;

import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Stack, Avatar, Box
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationSearch from './LocationSearch';
import StyledTooltip from '../common/StyledTooltip';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((state) => state.auth);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [location, setLocation] = useState('');

  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  // const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  // const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#0A1427' }}>
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          gap: { xs: 1, sm: 0 }
        }}
      >
        {/* Left: Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            width: '100%',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          BookTable
        </Typography>

        {/* Right: Location + Auth */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
          sx={{ width: '100%', justifyContent: { sm: 'flex-end' } }}
        >
          <Box
            sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <LocationSearch
              value={location}
              onChange={(value) => setLocation(value)}
              featuredCities={featuredCities}
            />
          </Box>

          {/* Avatar or Sign In */}
          {!token ? (
            <Button
              variant="outlined"
              component={RouterLink}
              to="/login"
              fullWidth={true}
              sx={{
                borderColor: '#2DD4BF',
                color: '#2DD4BF',
                '&:hover': {
                  bgcolor: '#14B8A6',
                  color: '#fff',
                  borderColor: '#14B8A6'
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <PersonOutlineIcon sx={{ mr: 1 }} />
              Sign In
            </Button>
          ) : (
            <>
              {/* Avatar */}
              <StyledTooltip title={email}>
                <Avatar sx={{ bgcolor: '#2DD4BF' }}>
                  {email?.charAt(0).toUpperCase()}
                </Avatar>
              </StyledTooltip>

              {/* Role-based Dashboard */}
              {(role === 'ADMIN' || role === 'RESTAURANT_MANAGER') && (
                <Button
                  variant="text"
                  component={RouterLink}
                  to={role === 'ADMIN' ? '/admin/dashboard' : '/manager/dashboard'}
                  sx={{
                    color: '#2DD4BF',
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Dashboard
                </Button>
              )}

              {/* Logout */}
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  borderColor: '#2DD4BF',
                  color: '#2DD4BF',
                  '&:hover': {
                    bgcolor: '#14B8A6',
                    color: '#fff',
                    borderColor: '#14B8A6'
                  },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>

    </AppBar>
  );
};

export default Header;

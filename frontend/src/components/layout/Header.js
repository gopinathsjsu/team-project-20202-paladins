import React, { useState, useMemo } from 'react'; // Import useState
import {
  AppBar, Toolbar, Typography, Button, Stack, Avatar, Box,
  Menu, MenuItem, ListItemIcon
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationSearch from './LocationSearch';
import { setLocation } from '../../redux/slices/searchSlice';
import StyledTooltip from '../common/StyledTooltip';
// Import Icons for Menu Items (Optional but good UX)
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((state) => state.auth);
  const location = useSelector((state) => state.search.location);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogoutAndClose = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
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
              onChange={(value) => dispatch(setLocation(value))}
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
              {/* Role-based Dashboard (keep separate from user menu) */}
              {(role === 'ADMIN' || role === 'RESTAURANT_MANAGER') && (
                <Button
                  variant="text"
                  component={RouterLink}
                  to={role === 'ADMIN' ? '/admin/dashboard' : '/manager/dashboard'}
                  sx={{
                    color: '#2DD4BF',
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    order: { xs: 1, sm: 0 } // Adjust order if needed
                  }}
                >
                  Dashboard
                </Button>
              )}

              {/* Avatar with Tooltip and Click Handler */}
              <StyledTooltip title={email ?? 'User Menu'}>
                {/* Add id for accessibility */}
                <Avatar
                  id="user-avatar-button"
                  sx={{ bgcolor: '#2DD4BF', cursor: 'pointer', order: { xs: 0, sm: 1 } }}
                  onClick={handleMenuOpen}
                  aria-controls={isMenuOpen ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : undefined}
                >
                  {email?.charAt(0).toUpperCase()}
                </Avatar>
              </StyledTooltip>

              {/* User Dropdown Menu */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'user-avatar-button', // Referencing the Avatar button
                }}
                // Position the menu below the avatar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleNavigate('/profile')}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/profile/update')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Update Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/bookings')}>
                  <ListItemIcon>
                    <EventNoteIcon fontSize="small" />
                  </ListItemIcon>
                  My Bookings
                </MenuItem>
                <MenuItem onClick={handleLogoutAndClose}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>

              {/* Removed the separate Logout Button */}
            </>
          )}
        </Stack>
      </Toolbar>

    </AppBar>
  );
};

export default Header;
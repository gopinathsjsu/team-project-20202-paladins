import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  TextField,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext';
import { getS3ImageUrl } from '../../utils/s3Utils';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchParams, setSearchParams] = useState({
    q: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Mock data for restaurants
  const mockRestaurants = [
    {
      id: 1,
      name: 'Gourmet Kitchen',
      image: getS3ImageUrl('restaurants/gourmet-kitchen.jpg')
    },
    {
      id: 2,
      name: 'Sushi Master',
      image: getS3ImageUrl('restaurants/sushi-master.jpg')
    },
    {
      id: 3,
      name: 'Spice Route',
      image: getS3ImageUrl('restaurants/spice-route.jpg')
    }
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchParams.q) queryParams.append('q', searchParams.q);
    if (searchParams.location) queryParams.append('location', searchParams.location);
    
    navigate(`/search?${queryParams.toString()}`);
  };

  const handleLogoClick = () => {
    setSearchParams({
      q: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
    navigate('/');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={handleLogoClick}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              mr: 2
            }}
          >
            BookTable
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
              <TextField
                size="small"
                placeholder="Search restaurants..."
                value={searchParams.q}
                onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
                onKeyPress={handleKeyPress}
                sx={{ width: 300 }}
              />
              <TextField
                size="small"
                placeholder="Location"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                onKeyPress={handleKeyPress}
                sx={{ width: 200 }}
              />
              <TextField
                size="small"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                sx={{ width: 150 }}
              />
              <TextField
                size="small"
                type="time"
                value={searchParams.time}
                onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
                sx={{ width: 150 }}
              />
              <IconButton onClick={handleSearch} color="primary">
                <SearchIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/my-bookings">
                  My Bookings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              size="small"
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
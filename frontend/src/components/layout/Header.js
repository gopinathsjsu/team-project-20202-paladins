import React, { useState, useEffect } from 'react'; // Added useEffect
import {
  AppBar, Toolbar, Typography, Button, Stack, Avatar,
  Menu, MenuItem, ListItemIcon, TextField, InputAdornment
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setCity, setZip, setState } from '../../redux/slices/searchSlice';
import StyledTooltip from '../common/StyledTooltip';
// Import Icons for Menu Items (Optional but good UX)
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public'; // Icon for State
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // For Admin specific links
import DashboardIcon from '@mui/icons-material/Dashboard'; // For Manager Dashboard

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((state) => state.auth);
  const cityFromStore = useSelector((state) => state.search.city);
  const zipFromStore = useSelector((state) => state.search.zip);
  const stateFromStore = useSelector((state) => state.search.state);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [headerCity, setHeaderCity] = useState(cityFromStore || '');
  const [headerZip, setHeaderZip] = useState(zipFromStore || '');
  const [headerState, setHeaderState] = useState(stateFromStore || '');

  useEffect(() => {
    setHeaderCity(cityFromStore || '');
    setHeaderZip(zipFromStore || '');
    setHeaderState(stateFromStore || '');
  }, [cityFromStore, zipFromStore, stateFromStore]);


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

  const handleCityBlur = () => {
    dispatch(setCity(headerCity));
  };

  const handleZipBlur = () => {
    dispatch(setZip(headerZip));
  };

  const handleStateBlur = () => {
    dispatch(setState(headerState));
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
          gap: { xs: 1, sm: 2 }
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
          spacing={1.5}
          alignItems="center"
          sx={{ width: '100%', justifyContent: { sm: 'flex-end' } }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="City"
            value={headerCity}
            onChange={(e) => setHeaderCity(e.target.value)}
            onBlur={handleCityBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 150,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)', },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', },
                '&.Mui-focused fieldset': { borderColor: '#2DD4BF', },
              },
              '& .MuiInputBase-input': { color: 'white', },
            }}
          />
          <TextField
            variant="outlined"
            size="small"
            placeholder="State (e.g., NY)"
            value={headerState}
            onChange={(e) => setHeaderState(e.target.value)}
            onBlur={handleStateBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 2 }}
            sx={{
              minWidth: 100,
              width: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)', },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', },
                '&.Mui-focused fieldset': { borderColor: '#2DD4BF', },
              },
              '& .MuiInputBase-input': { color: 'white', },
            }}
          />
          <TextField
            variant="outlined"
            size="small"
            placeholder="Zip Code"
            value={headerZip}
            onChange={(e) => setHeaderZip(e.target.value)}
            onBlur={handleZipBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDropIcon sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 120,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)', },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', },
                '&.Mui-focused fieldset': { borderColor: '#2DD4BF', },
              },
              '& .MuiInputBase-input': { color: 'white', },
            }}
          />

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
              {/* Avatar with Tooltip and Click Handler */}
              <StyledTooltip title={email ?? 'User Menu'}>
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
                  'aria-labelledby': 'user-avatar-button',
                }}
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

                {/* "My Bookings" for CUSTOMER only */}
                {role === 'CUSTOMER' && (
                  <MenuItem onClick={() => handleNavigate('/bookings')}>
                    <ListItemIcon>
                      <EventNoteIcon fontSize="small" />
                    </ListItemIcon>
                    My Bookings
                  </MenuItem>
                )}

                {/* "Restaurant Requests" for ADMIN only */}
                {role === 'ADMIN' && (
                  <MenuItem onClick={() => handleNavigate('/admin/dashboard')}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Restaurant Requests
                  </MenuItem>
                )}
                
                {/* "My Dashboard" for RESTAURANT_MANAGER only */}
                {role === 'RESTAURANT_MANAGER' && (
                  <MenuItem onClick={() => handleNavigate('/manager/dashboard')}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    My Dashboard
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogoutAndClose}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>

    </AppBar>
  );
};

export default Header;
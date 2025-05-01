import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Autocomplete,
  Avatar,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PeopleIcon from '@mui/icons-material/People';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import StyledTooltip from '../common/StyledTooltip.js';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import API from "../../api/API.js";
import { API_ENDPOINTS } from "../../constants/api.js";

const Header = () => {
  const [searchParams, setSearchParams] = useState({
    restaurant: '',
    location: '',
    date: dayjs().format('YYYY-MM-DD'),
    time: '19:00',
    partySize: 2
  });

  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((state) => state.auth);

  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  const handleLocationInputChange = async (event, newValue, reason) => {
    setLocationInput(newValue);

    // Check if input is a 5-digit ZIP code
    if (newValue?.match(/^\d{5}$/)) {
      try {
        const response = await fetch(`http://api.zippopotam.us/us/${newValue}`);
        if (response.ok) {
          const data = await response.json();
          const place = data.places[0];
          const cityName = `${place['place name']}, ${place['state abbreviation']}`;

          setLocationInput(cityName);
          setSearchParams(prev => ({ ...prev, location: cityName }));
        }
      } catch (error) {
        console.error(error);
      }
    } else if (newValue && newValue.length >= 2) {
      try {
        const response = await fetch(`/api/cities?search=${newValue}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data.map(city => ({ name: `${city.city}, ${city.state}`, featured: false, raw: city })));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearch = async () => {
    console.log('Searching with params:', searchParams);

    try {
      // Format time to HH:MM:SS
      const formattedTime = searchParams.time ? `${searchParams.time}:00` : null;

      const response = await API.get(API_ENDPOINTS.RESTAURANTS.SEARCH, {
        params: {
          ...searchParams,
          startTime: formattedTime,
        }
      });

      if (response.status === 200) {
        console.log('Search results:', response.data);
        // Navigate to the results page, passing the results
        navigate('/restaurants', { state: { searchResults: response.data }, replace: true });

      } else {
        console.error('Failed to fetch search results');
        // Optionally handle the error, perhaps by setting an error message state
      }
    } catch (error) {
      console.error('Error during search:', error);
      // Optionally handle the error, perhaps by setting an error message state
    }
  };

  const allCities = useMemo(() => [...featuredCities, ...cities], [featuredCities, cities]);

  const commonInputStyles = {
    '& .MuiInputBase-root': {
      height: '48px',
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: '1px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.5)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2DD4BF',
      },
      bgcolor: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      p: 1
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
      color: 'white',
      '&::placeholder': {
        color: 'rgba(255,255,255,0.7)',
        opacity: 1,
      },
    },
    '& .MuiAutocomplete-input': {
      padding: '7.5px 14px !important',
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: 'white'
    },
    '& .MuiAutocomplete-clearIndicator': {
      color: 'white'
    }
  };

  return (
      <AppBar position="static" sx={{ bgcolor: '#0A1427' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Left section - Logo */}
          <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                minWidth: 'fit-content'
              }}
          >
            BookTable
          </Typography>

          {/* Middle section - Search Parameters */}
          <Stack
              direction="row"
              spacing={2}
              sx={{
                flex: 1,
                mx: 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
          >
            {/* Restaurant Search */}
            <TextField
                placeholder="Search restaurants"
                value={searchParams.restaurant}
                onChange={(e) => setSearchParams({ ...searchParams, restaurant: e.target.value })}
                sx={{ ...commonInputStyles, width: '300px' }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><RestaurantIcon /></InputAdornment>) }}
            />
            {/* Date Input */}
            <TextField
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                sx={{ ...commonInputStyles, width: '200px', '& .MuiInputBase-input': { color: 'white', cursor: 'pointer', textAlign: 'center', '&::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.7, cursor: 'pointer' } } }}
                inputProps={{ style: { textAlign: 'center' } }}
            />
            {/* Time Input */}
            <TextField
                type="time"
                value={searchParams.time}
                onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
                sx={{ ...commonInputStyles, width: '180px', '& .MuiInputBase-input': { color: 'white', cursor: 'pointer', '&::-webkit-calendar-picker-indicator': { filter: 'invert(1)', opacity: 0.7, cursor: 'pointer' } } }}
                inputProps={{ style: { textAlign: 'center' } }}
            />
            {/* Party Size */}
            <Autocomplete
                disableClearable={true}
                value={searchParams.partySize.toString()}
                onChange={(_, newValue) => { setSearchParams({ ...searchParams, partySize: parseInt(newValue || '1') }); }}
                options={[...Array(10)].map((_, i) => (i + 1).toString())}
                getOptionLabel={(option) => `${option} ${parseInt(option) === 1 ? 'Person' : 'People'}`}
                sx={{ width: '190px', ...commonInputStyles }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Party size"
                        InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><PeopleIcon sx={{ color: 'white' }} /></InputAdornment>) }}
                    />
                )}
            />
            {/* Search Button */}
            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ bgcolor: '#2DD4BF', '&:hover': { bgcolor: '#14B8A6' }, height: '48px', minWidth: 'fit-content', borderRadius: '8px' }}
            >
              <SearchIcon />
            </Button>
          </Stack>

          {/* Right section - Location and Sign In */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
            {/* Location */}
            <Autocomplete
                disableClearable={true}
                freeSolo
                value={searchParams.location}
                inputValue={locationInput}
                onInputChange={handleLocationInputChange}
                onChange={(_, newValue) => {
                  const locationValue = typeof newValue === 'string' ? newValue : newValue?.name || '';
                  setSearchParams(prev => ({ ...prev, location: locationValue }));
                  setLocationInput(locationValue);
                }}
                options={allCities}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option.name || '';
                }}
                groupBy={(option) => {
                  if (typeof option === 'string') return 'All Cities';
                  return option.featured ? 'Featured Cities' : 'All Cities';
                }}
                sx={{ minWidth: 280, ...commonInputStyles }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Enter city or ZIP code"
                        InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><LocationOnIcon sx={{ color: 'white', ml: 1 }} /></InputAdornment>) }}
                    />
                )}
            />

            {!token ? (
                <Button
                    variant="contained"
                    sx={{ bgcolor: '#2DD4BF', '&:hover': { bgcolor: '#14B8A6' }, height: '48px', borderRadius: '8px', px: 3 }}
                    component={RouterLink}
                    to="/login"
                >
                  <PersonOutlineIcon sx={{ mr: 1 }} />
                  Sign In
                </Button>
            ) : (
                <>
                  <StyledTooltip title={email}>
                    <Avatar sx={{ bgcolor: '#2DD4BF' }}>{email?.charAt(0).toUpperCase()}</Avatar>
                  </StyledTooltip>
                  {(role === 'ADMIN' || role === 'RESTAURANT_MANAGER') && (
                      <Button variant="text" component={RouterLink} to={role === 'ADMIN' ? '/admin/dashboard' : '/manager/dashboard'} sx={{ color: '#2DD4BF', textTransform: 'none' }}>
                        Dashboard
                      </Button>
                  )}
                  <Button
                      variant="outlined"
                      sx={{ borderColor: '#2DD4BF', color: '#2DD4BF', '&:hover': { bgcolor: '#14B8A6', color: '#fff', borderColor: '#14B8A6' } }}
                      onClick={() => { dispatch(logout()); navigate('/login'); }}
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
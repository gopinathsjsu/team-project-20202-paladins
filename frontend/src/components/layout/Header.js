import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
  Autocomplete,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PeopleIcon from '@mui/icons-material/People';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

import StyledTooltip from '../common/StyledTooltip';

const Header = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2
  });

  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);

  // Define featured cities
  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((state) => state.auth);

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
        console.error('Error fetching location from ZIP:', error);
      }
    } else if (newValue && newValue.length >= 2) {
      try {
        const response = await fetch(`/api/cities?search=${newValue}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data.map(city => ({ 
            name: `${city.city}, ${city.state}`, 
            featured: false,
            raw: city // Keep the raw data for reference if needed
          })));
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
  };

  const handleSearch = () => {
    console.log('Searching with params:', searchParams);
    // TODO: Implement search functionality
  };

  // Combine featured cities with API results
  const allCities = useMemo(() => {
    return [...featuredCities, ...cities];
  }, [featuredCities, cities]);

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
          spacing={1} 
          sx={{ 
            flex: 1,
            mx: 3,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            p: 1
          }}
        >
          {/* Date Input */}
          <TextField
            type="date"
            value={searchParams.date}
            onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
            sx={{
              width: 150,
              '& .MuiInputBase-root': {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                bgcolor: 'transparent'
              },
              '& .MuiInputBase-input': { 
                py: 1,
                color: 'white',
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'
                }
              }
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Time Input */}
          <TextField
            type="time"
            value={searchParams.time}
            onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
            sx={{
              width: 120,
              '& .MuiInputBase-root': {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                bgcolor: 'transparent'
              },
              '& .MuiInputBase-input': { 
                py: 1,
                color: 'white',
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'
                }
              }
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Party Size */}
          <Autocomplete
            value={searchParams.partySize.toString()}
            onChange={(_, newValue) => {
              setSearchParams({ 
                ...searchParams, 
                partySize: parseInt(newValue || '1')
              });
            }}
            options={[...Array(10)].map((_, i) => (i + 1).toString())}
            getOptionLabel={(option) => `${option} ${parseInt(option) === 1 ? 'Person' : 'People'}`}
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                bgcolor: 'transparent',
                py: 0
              },
              '& .MuiAutocomplete-input': {
                color: 'white',
              },
              '& .MuiAutocomplete-popupIndicator': {
                color: 'white'
              },
              '& .MuiAutocomplete-clearIndicator': {
                color: 'white'
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Party size"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: '#2DD4BF',
              '&:hover': { bgcolor: '#14B8A6' },
              minWidth: 'fit-content'
            }}
          >
            <SearchIcon />
          </Button>
        </Stack>

        {/* Right section - Location and Sign In */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Location */}
          <Autocomplete
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
              if (typeof option === 'string') {
                return option;
              }
              return option.name || '';
            }}
            groupBy={(option) => {
              if (typeof option === 'string') return 'All Cities';
              return option.featured ? 'Featured Cities' : 'All Cities';
            }}
            sx={{ 
              minWidth: 280,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '25px',
                py: 0.5,
                pl: 1
              },
              '& .MuiAutocomplete-input': {
                color: 'white',
              },
              '& .MuiAutocomplete-popupIndicator': {
                color: 'white'
              },
              '& .MuiAutocomplete-clearIndicator': {
                color: 'white'
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter city or ZIP code"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: 'white', ml: 1 }} />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

        {!token ? (
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#2DD4BF', '&:hover': { bgcolor: '#14B8A6' } }}
            component={RouterLink}
            to="/login"
          >
            <PersonOutlineIcon sx={{ mr: 1 }} />
            Sign In
          </Button>
        ) : (
          <>
            <StyledTooltip title={email}>
              <Avatar sx={{ bgcolor: '#2DD4BF' }}>
                {email?.charAt(0).toUpperCase()}
              </Avatar>
            </StyledTooltip>

            {(role === 'ADMIN' || role === 'RESTAURANT_MANAGER') && (
              <Button
                variant="text"
                component={RouterLink}
                to={role === 'ADMIN' ? '/admin/dashboard' : '/manager/dashboard'}
                sx={{ color: '#2DD4BF', textTransform: 'none' }}
              >
                Dashboard
              </Button>
            )}

            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: '#2DD4BF', 
                color: '#2DD4BF', 
                '&:hover': {
                  bgcolor: '#14B8A6',
                  color: '#fff',
                  borderColor: '#14B8A6'
                }
              }}
              onClick={() => {
                dispatch(logout());
                navigate('/login');
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
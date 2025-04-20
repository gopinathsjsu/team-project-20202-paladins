import React, { useState, useMemo, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
  Autocomplete,
  InputAdornment,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({
    q: '', // For search filtering
    location: '', // For location filtering
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    time: '19:00', // Default to 7:00 PM
  });

  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Define featured cities
  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  // Mock restaurant data for frontend filtering
  const mockRestaurants = [
    { id: 1, name: 'Gourmet Kitchen', cuisine: 'Italian' },
    { id: 2, name: 'Sushi Master', cuisine: 'Japanese' },
    { id: 3, name: 'Spice Route', cuisine: 'Indian' },
    { id: 4, name: 'La Petite Bistro', cuisine: 'French' },
    { id: 5, name: 'Taco Fiesta', cuisine: 'Mexican' },
    { id: 6, name: 'The Steakhouse', cuisine: 'American' }
  ];

  // Filter restaurants based on search query
  const filteredRestaurants = useMemo(() => {
    const query = searchParams.q.toLowerCase();
    if (!query) return [];
    return mockRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query)
    );
  }, [searchParams.q]);

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

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, q: value }));
    setIsSearching(!!value);
    setAnchorEl(e.currentTarget);
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSearchParams(prev => ({ ...prev, q: restaurant.name }));
    setIsSearching(false);
    // Navigate with all search parameters
    const queryParams = new URLSearchParams({
      location: searchParams.location,
      q: restaurant.name
    });
    navigate(`/search?${queryParams.toString()}`);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchParams.q) queryParams.append('q', searchParams.q);
    if (searchParams.location) queryParams.append('location', searchParams.location);

    // Update URL without navigation
    window.history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);
    
    // Trigger a custom event to notify components about the search
    const event = new CustomEvent('searchUpdated', { 
      detail: { 
        searchParams: {
          q: searchParams.q,
          location: searchParams.location
        }
      }
    });
    window.dispatchEvent(event);
  };

  // Combine featured cities with API results
  const allCities = useMemo(() => {
    return [...featuredCities, ...cities];
  }, [featuredCities, cities]);

  const handleLogoClick = () => {
    // Clear search parameters
    setSearchParams(prev => ({ ...prev, q: '', location: '' }));
    
    // Navigate to root path without any query parameters
    navigate('/');
    
    // Trigger search update to show all restaurants
    const event = new CustomEvent('searchUpdated', { 
      detail: { 
        searchParams: {
          q: '',
          location: ''
        }
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#0A1427' }}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Left section - Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          onClick={handleLogoClick}
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
            onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
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
            onChange={(e) => setSearchParams(prev => ({ ...prev, time: e.target.value }))}
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

          {/* Restaurant Search Input with Dropdown */}
          <Box sx={{ position: 'relative', flex: 1 }}>
            <TextField
              placeholder="Search restaurants..."
              value={searchParams.q}
              onChange={handleSearchInputChange}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  bgcolor: 'transparent'
                },
                '& .MuiInputBase-input': { 
                  py: 1,
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleSearch}
                      sx={{
                        minWidth: '40px',
                        width: '40px',
                        height: '40px',
                        bgcolor: '#2DD4BF',
                        '&:hover': {
                          bgcolor: '#14B8A6'
                        },
                        borderRadius: '4px',
                        p: 0
                      }}
                    >
                      <SearchIcon sx={{ color: 'white' }} />
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            {/* Dropdown for search results */}
            {isSearching && filteredRestaurants.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  bgcolor: '#1a2635',
                  borderRadius: 1,
                  boxShadow: 3,
                  zIndex: 1000
                }}
              >
                <List>
                  {filteredRestaurants.map((restaurant) => (
                    <ListItem
                      key={restaurant.id}
                      button
                      onClick={() => {
                        setSearchParams(prev => ({ ...prev, q: restaurant.name }));
                        setIsSearching(false);
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(45, 212, 191, 0.1)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={restaurant.name}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {restaurant.cuisine}
                          </Typography>
                        }
                        primaryTypographyProps={{
                          sx: { color: 'white' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Stack>

        {/* Right section - Location and Sign In */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Location */}
          <Autocomplete
            freeSolo
            disableClearable
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

          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#2DD4BF',
              '&:hover': {
                bgcolor: '#14B8A6'
              }
            }}
            component={RouterLink}
            to="/login"
          >
            <PersonOutlineIcon sx={{ mr: 1 }} />
            Sign In
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationSearch from './LocationSearch';
import SearchParams from './SearchParams';

const Header = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2
  });

  // Define featured cities
  const featuredCities = useMemo(() => [
    { name: 'New York, NY', featured: true },
    { name: 'Los Angeles, CA', featured: true },
    { name: 'San Francisco, CA', featured: true },
    { name: 'Chicago, IL', featured: true },
  ], []);

  const handleSearch = () => {
    // Convert search parameters to URL query parameters
    const queryParams = new URLSearchParams({
      location: searchParams.location,
      date: searchParams.date,
      time: searchParams.time,
      partySize: searchParams.partySize.toString()
    });

    // Navigate to the search results page with the query parameters
    navigate(`/search?${queryParams.toString()}`);
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
        <SearchParams 
          searchParams={searchParams}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
        />

        {/* Right section - Location and Sign In */}
        <Stack direction="row" spacing={2} alignItems="center">
          <LocationSearch
            value={searchParams.location}
            onChange={(location) => setSearchParams(prev => ({ ...prev, location }))}
            featuredCities={featuredCities}
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
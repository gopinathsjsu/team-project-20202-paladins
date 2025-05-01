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
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import StyledTooltip from '../common/StyledTooltip';
import API from '../../api/API';
import { API_ENDPOINTS } from '../../constants/api';

const Header = () => {
  /* ------------ UI state ------------ */
  const [searchParams, setSearchParams] = useState({
    restaurant: '',
    date: dayjs().format('YYYY-MM-DD'),
    time: '19:00',
    partySize: 2,
  });
  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);

  /* ------------ Redux / routing ------ */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, role } = useSelector((s) => s.auth);

  /* ------------ featured cities ------ */
  const featuredCities = useMemo(
      () => [
        { name: 'New York, NY', featured: true },
        { name: 'Los Angeles, CA', featured: true },
        { name: 'San Francisco, CA', featured: true },
        { name: 'Chicago, IL', featured: true },
      ],
      []
  );
  const allCities = useMemo(() => [...featuredCities, ...cities], [featuredCities, cities]);

  /* ------------ location handler ----- */
  const handleLocationChange = async (_e, newInput, reason) => {
    setLocationInput(newInput);
    if (reason === 'clear' || newInput === '') return;

    if (/^\d{5}$/.test(newInput)) {
      // ZIP lookup
      try {
        const res = await fetch(`http://api.zippopotam.us/us/${newInput}`);
        if (!res.ok) return;
        const data = await res.json();
        const cs = `${data.places[0]['place name']}, ${data.places[0]['state abbreviation']}`;
        setLocationInput(cs);
      } catch (err) {
        console.error(err);
      }
    } else if (newInput.length >= 2) {
      // city autocomplete
      try {
        const res = await fetch(`/api/cities?search=${newInput}`);
        if (!res.ok) return;
        const data = await res.json();
        setCities(
            data.map((c) => ({
              name: `${c.city}, ${c.state}`,
              featured: false,
              raw: c,
            }))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* ------------ search action -------- */
  const handleSearch = async () => {
    /* split “City, ST” or ZIP */
    let city = '';
    let state = '';
    let zip = '';
    const loc = locationInput.trim();

    if (/^\d{5}$/.test(loc)) {
      zip = loc;
    } else if (loc.includes(',')) {
      [city, state] = loc.split(',').map((s) => s.trim());
    }

    const params = {
      restaurant: searchParams.restaurant.trim(),
      city,
      state,
      zip,
      partySize: searchParams.partySize,
      startTime: `${searchParams.time}:00`,
    };

    try {
      const { data, status } = await API.get(API_ENDPOINTS.RESTAURANTS.SEARCH, { params });
      if (status === 200) {
        navigate('/restaurants', { state: { searchResults: data }, replace: true });
      } else {
        console.error('Search failed', status);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  /* ------------ shared styles -------- */
  const commonInputStyles = {
    '& .MuiInputBase-root': {
      height: 48,
      color: 'white',
      bgcolor: 'rgba(255,255,255,0.1)',
      borderRadius: 1,
      p: 1,
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2DD4BF' },
    },
    '& .MuiInputBase-input': {
      p: '12px 14px',
      color: 'white',
      '&::placeholder': { color: 'rgba(255,255,255,0.7)', opacity: 1 },
    },
    '& .MuiAutocomplete-input': { p: '7.5px 14px !important' },
    '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator': { color: 'white' },
  };

  /* ------------ render --------------- */
  return (
      <AppBar position="static" sx={{ bgcolor: '#0A1427' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* logo */}
          <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.5rem' }}
          >
            BookTable
          </Typography>

          {/* search inputs */}
          <Stack direction="row" spacing={2} sx={{ flex: 1, mx: 3, alignItems: 'center' }}>
            <TextField
                placeholder="Search restaurants"
                value={searchParams.restaurant}
                onChange={(e) => setSearchParams({ ...searchParams, restaurant: e.target.value })}
                sx={{ ...commonInputStyles, width: 300 }}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <RestaurantIcon />
                      </InputAdornment>
                  ),
                }}
            />
            <TextField
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                sx={{ ...commonInputStyles, width: 200, '& .MuiInputBase-input': { textAlign: 'center' } }}
            />
            <TextField
                type="time"
                value={searchParams.time}
                onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
                sx={{ ...commonInputStyles, width: 180 }}
            />
            <Autocomplete
                disableClearable
                value={searchParams.partySize.toString()}
                onChange={(_, v) => setSearchParams({ ...searchParams, partySize: parseInt(v, 10) })}
                options={[...Array(10)].map((_, i) => (i + 1).toString())}
                getOptionLabel={(o) => `${o} ${parseInt(o, 10) === 1 ? 'Person' : 'People'}`}
                sx={{ width: 190, ...commonInputStyles }}
                renderInput={(p) => (
                    <TextField
                        {...p}
                        placeholder="Party size"
                        InputProps={{
                          ...p.InputProps,
                          startAdornment: (
                              <InputAdornment position="start">
                                <PeopleIcon sx={{ color: 'white' }} />
                              </InputAdornment>
                          ),
                        }}
                    />
                )}
            />
            <Button variant="contained" sx={{ bgcolor: '#2DD4BF' }} onClick={handleSearch}>
              <SearchIcon />
            </Button>
          </Stack>

          {/* location + auth */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
            <Autocomplete
                freeSolo
                disableClearable
                value={locationInput}
                inputValue={locationInput}
                onInputChange={handleLocationChange}
                onChange={handleLocationChange}
                options={allCities}
                getOptionLabel={(o) => (typeof o === 'string' ? o : o.name || '')}
                groupBy={(o) =>
                    typeof o === 'string' ? 'All Cities' : o.featured ? 'Featured Cities' : 'All Cities'
                }
                sx={{ minWidth: 280, ...commonInputStyles }}
                renderInput={(p) => (
                    <TextField
                        {...p}
                        placeholder="Enter city or ZIP code"
                        InputProps={{
                          ...p.InputProps,
                          startAdornment: (
                              <InputAdornment position="start">
                                <LocationOnIcon sx={{ color: 'white', ml: 1 }} />
                              </InputAdornment>
                          ),
                        }}
                    />
                )}
            />

            {!token ? (
                <Button
                    variant="contained"
                    sx={{ bgcolor: '#2DD4BF', px: 3 }}
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
                      sx={{ borderColor: '#2DD4BF', color: '#2DD4BF' }}
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

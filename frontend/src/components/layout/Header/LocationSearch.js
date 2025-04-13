import React, { useState } from 'react';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationSearch = ({ value, onChange, featuredCities }) => {
  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);

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
          onChange(cityName);
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
            raw: city
          })));
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
  };

  const allCities = [...featuredCities, ...cities];

  return (
    <Autocomplete
      freeSolo
      value={value}
      inputValue={locationInput}
      onInputChange={handleLocationInputChange}
      onChange={(_, newValue) => {
        const locationValue = typeof newValue === 'string' ? newValue : newValue?.name || '';
        onChange(locationValue);
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
  );
};

export default LocationSearch; 
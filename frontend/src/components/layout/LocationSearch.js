import React, { useState } from 'react';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationSearch = ({ value, onChange, featuredCities }) => {
  const [locationInput, setLocationInput] = useState('');
  const [cities, setCities] = useState([]);

  const handleLocationInputChange = async (event, newValue) => {
    // console.log("Handling: ", newValue);
    setLocationInput(newValue);

    // ZIP code detection
    if (newValue?.match(/^\d{5}$/)) {
      try {
        const res = await fetch(`http://api.zippopotam.us/us/${newValue}`);
        if (res.ok) {
          const data = await res.json();
          const place = data.places[0];
          const cityName = `${place['place name']}, ${place['state abbreviation']}`;
          setLocationInput(cityName);
          onChange(cityName);
        }
      } catch (err) {
        console.error('ZIP lookup failed:', err);
      }
    } else if (newValue && newValue.length >= 2) {
      try {
        const res = await fetch(`/api/cities?search=${newValue}`);
        if (res.ok) {
          const data = await res.json();
          setCities(data.map(city => ({
            name: `${city.city}, ${city.state}`,
            featured: false,
            raw: city
          })));
        }
      } catch (err) {
        console.error('City search failed:', err);
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
        const locationVal = typeof newValue === 'string' ? newValue : newValue?.name || '';
        onChange(locationVal);
        setLocationInput(locationVal);
      }}
      options={allCities}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
      groupBy={(option) => typeof option === 'string' ? 'All Cities' : (option.featured ? 'Featured Cities' : 'All Cities')}
      sx={{
        minWidth: 250,
        '& .MuiOutlinedInput-root': {
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.08)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
        },
        '& .MuiAutocomplete-input': { color: 'white' },
        '& .MuiAutocomplete-popupIndicator': { color: 'white' },
        '& .MuiAutocomplete-clearIndicator': { color: 'white' }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Enter city or ZIP code"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationSearch;

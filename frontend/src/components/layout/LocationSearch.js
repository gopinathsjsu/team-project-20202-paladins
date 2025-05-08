// src/components/layout/LocationSearch.js
import React, { useEffect, useCallback, useRef } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usePlacesWidget } from 'react-google-autocomplete';

const GOOGLE_PLACES_API_KEY = "AIzaSyDHvAT1cbsnyZKcSktuF-coSbs0Wkzo68Y";

const LocationSearch = ({ value, onChange }) => {

  const extractCityState = (place) => {
    let city = '';
    let state = '';
    if (!place || !place.address_components) {
      return { city, state };
    }
    for (const component of place.address_components) {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      }

      if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (city && state) break;
    }

    if (!city && state) {
      for (const component of place.address_components) {
        if (component.types.includes('administrative_area_level_2') && !city) {
          city = component.long_name;
        }
        if (component.types.includes('sublocality') && !city){
          city = component.long_name;
        }
      }
    }

    if (!city && state && place.name && !place.name.includes(state)) {
      city = place.name;
    }

    return { city, state };
  };


  // This callback is triggered by the hook when a user selects a place
  const handlePlaceSelected = useCallback((place) => {
    console.log('Raw Place Selected:', place);
    const { city, state } = extractCityState(place);
    let locationString = '';

    if (city && state) {
      locationString = `${city}, ${state}`;
    } else {
      locationString = place?.formatted_address || place?.name || '';
      console.warn("Could not extract 'City, ST', using fallback:", locationString);
    }

    console.log('Place Selected -> Calling onChange with:', locationString);
    onChange(locationString);
  }, [onChange]);

  // Initialize the Google Places Widget hook
  const { ref: placesRef } = usePlacesWidget({
    apiKey: GOOGLE_PLACES_API_KEY,
    onPlaceSelected: handlePlaceSelected,
    options: {
      types: ["(regions)"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "address_components", "name", "geometry"],
    },
  });

  useEffect(() => {
    if (placesRef.current && value === '' && placesRef.current.value !== '') {
      placesRef.current.value = '';
    }
  }, [value, placesRef]);


  return (
    <TextField
      defaultValue={value || ''}

      inputRef={placesRef}

      placeholder="Enter city, state or ZIP"
      fullWidth
      variant="outlined"
      sx={{
        minWidth: 250,
        '& .MuiOutlinedInput-root': {
          color: 'white',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& input': { color: 'white' },
          '& input::placeholder': { color: 'rgba(255, 255, 255, 0.7)', opacity: 1 }
        },
        '& .MuiInputAdornment-root svg': { color: 'white' }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default LocationSearch;
import React, { useEffect, useCallback, useRef } from 'react'; // Added useRef
import { TextField, InputAdornment } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { usePlacesWidget } from 'react-google-autocomplete';

const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
console.log('GOOGLE_PLACES_API_KEY', "AIzaSyDHvAT1cbsnyZKcSktuF-coSbs0Wkzo68Y");

const LocationSearch = ({ value, onChange }) => {

  const handlePlaceSelected = useCallback((place) => {
    const locationString = place?.formatted_address || '';
    console.log('Place Selected -> Updating State:', locationString);
    onChange(locationString);
  }, [onChange]);

  const { ref: placesRef } = usePlacesWidget({
    apiKey: GOOGLE_PLACES_API_KEY,
    onPlaceSelected: handlePlaceSelected,
    options: {
      types: ["(regions)"], // Use (regions) for City, State level usually
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "address_components", "geometry", "name"],
    },
    // If using libraries that conflict, you might need this, but try without first
    // dangerously_use_strict_mode: true
  });

  // Use a separate ref to potentially manage clearing if needed
  // const inputRef = useRef(); // You already have placesRef from the hook

  // Effect to clear the input visually if the external value prop is cleared
  useEffect(() => {
    // Check if the external value is empty and the ref is attached
    if (value === '' && placesRef.current && placesRef.current.value !== '') {
      console.log("External value cleared, clearing input ref.");
      placesRef.current.value = ''; // Directly clear the input via ref
    }
    // DO NOT set placesRef.current.value = value here; let defaultValue handle initial
  }, [value, placesRef]);


  return (
    <TextField
      // --- Use defaultValue for initial value ---
      // This sets the value when the component first renders based on Redux state,
      // but then allows the Google widget (via the ref) to control it without
      // React constantly overriding it via the `value` prop.
      defaultValue={value || ''} // Set initial value

      // --- REMOVE value and onChange ---
      // value={value || ''} // REMOVED - Conflicts with ref control
      // onChange={(e) => onChange(e.target.value)} // REMOVED - State update only happens on selection

      // --- Attach Google Places Hook Ref ---
      inputRef={placesRef} // Attach the ref here

      // --- Styling and Appearance (Keep as is) ---
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
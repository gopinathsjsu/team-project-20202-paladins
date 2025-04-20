import React from 'react';
import { Stack, TextField } from '@mui/material';

const SearchParams = ({ searchParams, onSearchParamsChange, onSearch }) => {
  return (
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
        onChange={(e) => onSearchParamsChange({ ...searchParams, date: e.target.value })}
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
        onChange={(e) => onSearchParamsChange({ ...searchParams, time: e.target.value })}
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
    </Stack>
  );
};

export default SearchParams; 
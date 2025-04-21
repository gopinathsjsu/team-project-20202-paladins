import React from 'react';
import {Autocomplete, Button, InputAdornment, Stack, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';

const SearchParams = ({searchParams, onSearchParamsChange, onSearch}) => {
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
                onChange={(e) => onSearchParamsChange({...searchParams, date: e.target.value})}
                sx={{
                    width: 150,
                    '& .MuiInputBase-root': {
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
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
                InputLabelProps={{shrink: true}}
            />

            {/* Time Input */}
            <TextField
                type="time"
                value={searchParams.time}
                onChange={(e) => onSearchParamsChange({...searchParams, time: e.target.value})}
                sx={{
                    width: 120,
                    '& .MuiInputBase-root': {
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
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
                InputLabelProps={{shrink: true}}
            />

            {/* Party Size */}
            <Autocomplete
                value={searchParams.partySize.toString()}
                onChange={(_, newValue) => {
                    onSearchParamsChange({
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
                        '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
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
                                    <PeopleIcon sx={{color: 'white'}}/>
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />

            {/* Search Button */}
            <Button
                variant="contained"
                onClick={onSearch}
                sx={{
                    bgcolor: '#2DD4BF',
                    '&:hover': {bgcolor: '#14B8A6'},
                    minWidth: 'fit-content'
                }}
            >
                <SearchIcon/>
            </Button>
        </Stack>
    );
};

export default SearchParams; 
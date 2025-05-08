import React, { useState } from "react";
import {
  Button, InputAdornment, MenuItem, Stack, TextField, useTheme, useMediaQuery
} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers"
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from 'dayjs';

const Search = ({ onSearch }) => {
  const [restaurant, setRestaurant] = useState("");
  const [pickerValue, setPickerValue] = useState(dayjs());
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));
  const [partySize, setPartySize] = useState(2);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    const params = {};
    if (restaurant) params.restaurant = restaurant;
    if (date) params.date = date;
    if (time) params.startTime = `${time}`;
    if (partySize) params.partySize = partySize;

    onSearch(params);
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems="stretch"
      sx={{
        mb: 4,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: "1000px",
        mx: "auto",
      }}
    >
      <TextField
        placeholder="Search restaurants"
        value={restaurant}
        onChange={(e) => setRestaurant(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RestaurantIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flex: 2, minWidth: 150 }}
      />


      <DateTimePicker
        label="When"
        ampm={false}
        value={pickerValue}
        onChange={newVal => {
          if (newVal?.isValid()) {
            setPickerValue(newVal);
            setDate(newVal.format('YYYY-MM-DD'));
            setTime(newVal.format('HH:mm:ss'));
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon />
                </InputAdornment>
              ),
            },
            sx: {
              flex: 1,
              minWidth: { xs: 140, sm: 200 },
            },
          },
        }}
      />


      <TextField
        select
        value={partySize}
        onChange={(e) => setPartySize(parseInt(e.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PeopleIcon />
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1, minWidth: 120 }}
      >
        {[...Array(20)].map((_, i) => (
          <MenuItem key={i + 1} value={i + 1}>
            {i + 1} {i + 1 === 1 ? "Person" : "People"}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          flexShrink: 0,
          minWidth: 48,
          px: 2,
          alignSelf: isMobile ? "stretch" : "center",
          bgcolor: "#2DD4BF",
          "&:hover": { bgcolor: "#14B8A6" }
        }}
      >
        <SearchIcon />
      </Button>
    </Stack>
  );
};

export default Search;
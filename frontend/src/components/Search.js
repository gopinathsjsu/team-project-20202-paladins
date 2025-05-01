import React, {useState} from "react";
import {Button, InputAdornment, MenuItem, Stack, TextField} from "@mui/material";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ onSearch }) => {
    const [restaurant, setRestaurant] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [partySize, setPartySize] = useState(2);

    const handleSearch = () => {
        const params = {};
        if (restaurant) params.restaurant = restaurant;
        if (date) params.date = date;
        if (time) {
            params.startTime = `${time}:00`;
        }
        if (partySize) params.partySize = partySize;

        onSearch(params);
    };

    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                mb: 4,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
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
                sx={{ flex: 1 }}
            />

            <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CalendarTodayIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ width: 180 }}
            />

            <TextField
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccessTimeIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ width: 140 }}
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
                sx={{ width: 140 }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14,15,16,17,18,19,20].map((count) => (
                    <MenuItem key={count} value={count}>
                        {count} {count === 1 ? "Person" : "People"}
                    </MenuItem>
                ))}
            </TextField>

            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ minWidth: 48, px: 2 }}
            >
                <SearchIcon />
            </Button>
        </Stack>
    );
};

export default Search;
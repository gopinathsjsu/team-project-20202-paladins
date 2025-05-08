import React, {useEffect, useState} from 'react';
import {Container, MenuItem, Select, Typography} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import API from "../../api/API";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [bookingData, setBookingData] = useState({labels: [], values: []});
  const [viewMode, setViewMode] = useState('daily');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  useEffect(() => {
    API.get('/api/restaurant')
      .then((res) => {
        setRestaurants(res.data);
        if (res.data.length > 0 && selectedRestaurant === '') {
          setSelectedRestaurant(''); // Ensure "All Restaurants" is selected by default
        }
      })
      .catch((err) => console.error(err));
  }, [selectedRestaurant]);

  useEffect(() => {
    const today = new Date();
    let startDate = new Date(today);
    if (viewMode === 'weekly') {
      startDate.setDate(today.getDate() - 6);
    } else if (viewMode === 'monthly') {
      startDate.setDate(today.getDate() - 29);
    }
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = today.toISOString().split('T')[0];
    setStartStr(startStr);
    setEndStr(endStr);

    let url = `/api/reservation/?startDate=${startStr}&endDate=${endStr}`;
    if (selectedRestaurant && selectedRestaurant !== 'all') {
      url += `&restaurantId=${selectedRestaurant}`;
    }

    API.get(url)
      .then((res) => {
        const grouped = res.data.reduce((acc, booking) => {
          const slot = `${booking.startSlotTime} - ${booking.endSlotTime}`;
          acc[slot] = (acc[slot] || 0) + 1;
          return acc;
        }, {});
        const chartLabels = Object.keys(grouped);
        const chartValues = Object.values(grouped);
        setBookingData({labels: chartLabels, values: chartValues});
      })
      .catch((err) => console.error(err));
  }, [viewMode, selectedRestaurant]);

  const chartData = {
    labels: bookingData.labels,
    datasets: [
      {
        label: 'Number of Bookings',
        data: bookingData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bookings by Time Slot (Table Number as Bar Height)',
      },
    },
  };

  return (
    <Container sx={{mt: 4}}>
      <Typography variant="h5" gutterBottom>
        Booking Analytics
      </Typography>

    <Select
      value={selectedRestaurant || ""}
      onChange={(e) => setSelectedRestaurant(e.target.value)}
      sx={{ my: 2, minWidth: 200 }}
    >
      <MenuItem value="all">All Restaurants</MenuItem>
      {restaurants.map((restaurant) => (
        <MenuItem key={restaurant.id} value={restaurant.id}>
          {restaurant.name}
        </MenuItem>
      ))}
    </Select>

      <Select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        sx={{my: 2, minWidth: 120}}
      >
        <MenuItem value="daily">Today's</MenuItem>
        <MenuItem value="weekly">Last Week</MenuItem>
        <MenuItem value="monthly">Last Month</MenuItem>
      </Select>
      <Typography variant="subtitle1" sx={{mb: 2}}>
        Showing bookings from {startStr} to {endStr}
      </Typography>
      <Bar data={chartData} options={chartOptions}/>
    </Container>
  );
};
export default AnalyticsDashboard;

import React, {useEffect, useState} from 'react';
import {Container, MenuItem, Select, Typography} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import API from "../../api/API";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [bookingData, setBookingData] = useState({ labels: [], values: [] });
  const [viewMode, setViewMode] = useState('daily');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const restaurantId = "6812ad84ca189206978c56d5";
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

    API.get(`/api/book?restaurantId=${restaurantId}&startDate=${startStr}&endDate=${endStr}`)
      .then((res) => {
        const grouped = res.data.reduce((acc, booking) => {
          const slot = `${booking.startSlotTime} - ${booking.endSlotTime}`;
          acc[slot] = (acc[slot] || 0) + 1;
          return acc;
        }, {});
        const chartLabels = Object.keys(grouped);
        const chartValues = Object.values(grouped);
        setBookingData({ labels: chartLabels, values: chartValues });
      })
      .catch((err) => console.error(err));
  }, [viewMode]);

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
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>
        Welcome, Admin. This is your dashboard.
      </Typography>
      <Select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        sx={{my: 2, minWidth: 120}}
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
      <Typography variant="subtitle1" sx={{mb: 2}}>
        Showing bookings from {startStr} to {endStr}
      </Typography>
      <Bar data={chartData} options={chartOptions}/>
    </Container>
  );
};
export default AnalyticsDashboard;

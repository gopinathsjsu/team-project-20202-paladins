import React, {useEffect, useState} from 'react';
import {Container, Typography} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import API from "../../api/API";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    API.get('/api/book?restaurantId=6812ad84ca189206978c56d5&date=2019-03-27')
      .then((res) => setBookingData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const chartData = {
    labels: bookingData.map(b => `${b.startSlotTime} - ${b.endSlotTime}`),
    datasets: [
      {
        label: 'Table Number',
        data: bookingData.map(b => parseInt(b.tableNumber, 10)),
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
      <Bar data={chartData} options={chartOptions}/>
    </Container>
  );
};
export default AnalyticsDashboard;

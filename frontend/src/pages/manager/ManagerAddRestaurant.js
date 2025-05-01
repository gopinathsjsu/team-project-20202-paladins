import React, { useState } from 'react';
import {
  Container, TextField, Typography, Button, Box, Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import { createRestaurant } from '../../api/restaurantAPI';

const ManagerAddRestaurant = () => {
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    name: '', description: '', addressStreet: '', addressCity: '',
    addressState: '', addressZip: '', phone: '', email: '', imageUrl: '',
    coordinatesLatitude: '', coordinatesLongitude: '', cuisines: '',
    openingHour: '10:00:00', closingHour: '22:00:00',
    tableCapacity: 2, tableCount: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      restaurantInput: {
        name: form.name,
        description: form.description,
        addressStreet: form.addressStreet,
        addressCity: form.addressCity,
        addressState: form.addressState,
        addressZip: form.addressZip,
        phone: form.phone,
        email: form.email,
        imageUrl: form.imageUrl,
        coordinatesLatitude: parseFloat(form.coordinatesLatitude),
        coordinatesLongitude: parseFloat(form.coordinatesLongitude),
        cuisines: form.cuisines.split(',').map((c) => c.trim()),
        openingHour: form.openingHour,
        closingHour: form.closingHour
      },
      table: {
        capacity: parseInt(form.tableCapacity),
        count: parseInt(form.tableCount)
      }
    };

    try {
      await createRestaurant(payload);
      alert('Restaurant created successfully!');
      setForm({
        name: '', description: '', addressStreet: '', addressCity: '',
        addressState: '', addressZip: '', phone: '', email: '', imageUrl: '',
        coordinatesLatitude: '', coordinatesLongitude: '', cuisines: '',
        openingHour: '10:00:00', closingHour: '22:00:00',
        tableCapacity: 2, tableCount: 5
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create restaurant');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Add New Restaurant
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Restaurant Name" name="name" fullWidth required value={form.name} onChange={handleChange} />
          <TextField label="Description" name="description" fullWidth required value={form.description} onChange={handleChange} />
          <TextField label="Street" name="addressStreet" value={form.addressStreet} onChange={handleChange} />
          <TextField label="City" name="addressCity" value={form.addressCity} onChange={handleChange} />
          <TextField label="State" name="addressState" value={form.addressState} onChange={handleChange} />
          <TextField label="ZIP" name="addressZip" value={form.addressZip} onChange={handleChange} />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
          <TextField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          <TextField label="Latitude" name="coordinatesLatitude" value={form.coordinatesLatitude} onChange={handleChange} />
          <TextField label="Longitude" name="coordinatesLongitude" value={form.coordinatesLongitude} onChange={handleChange} />
          <TextField label="Cuisines (comma separated)" name="cuisines" value={form.cuisines} onChange={handleChange} />
          <TextField label="Opening Hour (HH:MM:SS)" name="openingHour" value={form.openingHour} onChange={handleChange} />
          <TextField label="Closing Hour (HH:MM:SS)" name="closingHour" value={form.closingHour} onChange={handleChange} />
          <TextField label="Table Capacity" name="tableCapacity" value={form.tableCapacity} onChange={handleChange} />
          <TextField label="Number of Tables" name="tableCount" value={form.tableCount} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary">
            Create Restaurant
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ManagerAddRestaurant;

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateRestaurant } from "../../redux/slices/managerSlice";
import CloseIcon from "@mui/icons-material/Close";

const EditRestaurantModal = ({ open, handleClose, restaurantData }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    phone: "",
    email: "",
    imageUrl: "",
    cuisines: [],
    openingHour: "12:00",
    closingHour: "23:00",
    latitude: "",
    longitude: "",
    tableCapacity: 4,
    tableCount: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill the form with the existing restaurant data
  useEffect(() => {
    if (restaurantData) {
      setFormData({
        ...restaurantData,
        cuisines: restaurantData.cuisines || [],
      });
    }
  }, [restaurantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCuisinesChange = (e) => {
    setFormData({
      ...formData,
      cuisines: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const updatedRestaurantData = {
        restaurantInput: {
          ...formData
        },
        table: {
          capacity: formData.tableCapacity,
          count: formData.tableCount,
        },
      };
    

      try {
        await dispatch(updateRestaurant(updatedRestaurantData));
        setLoading(false);
        handleClose();
      } catch (err) {
        setLoading(false);
        setError("Failed to update restaurant. Please try again.");
      }
    };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            width: "80%",
            maxWidth: "600px",
            margin: "auto",
            marginTop: "5%",
            outline: "none",
            position: "relative",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            Edit Restaurant
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Restaurant Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Restaurant Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Street Address"
                  variant="outlined"
                  fullWidth
                  name="addressStreet"
                  value={formData.addressStreet}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="State"
                  variant="outlined"
                  fullWidth
                  name="addressState"
                  value={formData.addressState}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Zip Code"
                  variant="outlined"
                  fullWidth
                  name="addressZip"
                  value={formData.addressZip}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Image URL */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Restaurant Image URL"
                  variant="outlined"
                  fullWidth
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </Grid>

              {/* Cuisines */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="cuisines-label">Cuisines</InputLabel>
                  <Select
                    labelId="cuisines-label"
                    multiple
                    value={formData.cuisines}
                    onChange={handleCuisinesChange}
                    name="cuisines"
                    renderValue={(selected) => selected.join(", ")}
                  >
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="Chinese">Chinese</MenuItem>
                    <MenuItem value="Indian">Indian</MenuItem>
                    <MenuItem value="Mexican">Mexican</MenuItem>
                  </Select>
                  <FormHelperText>Select cuisines offered by your restaurant</FormHelperText>
                </FormControl>
              </Grid>

              {/* Latitude and Longitude */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Latitude"
                  variant="outlined"
                  fullWidth
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Longitude"
                  variant="outlined"
                  fullWidth
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </Grid>

              {/* Opening and Closing Hours */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Opening Hour"
                  variant="outlined"
                  fullWidth
                  name="openingHour"
                  type="time"
                  value={formData.openingHour}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Closing Hour"
                  variant="outlined"
                  fullWidth
                  name="closingHour"
                  type="time"
                  value={formData.closingHour}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Table Capacity and Count */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Table Capacity"
                  variant="outlined"
                  fullWidth
                  name="tableCapacity"
                  type="number"
                  value={formData.tableCapacity}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Table Count"
                  variant="outlined"
                  fullWidth
                  name="tableCount"
                  type="number"
                  value={formData.tableCount}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    backgroundColor: "#2DD4BF",
                    "&:hover": {
                      backgroundColor: "#26a69a",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Update Restaurant"}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Box sx={{ marginTop: 2, color: "error.main" }}>
              <Typography>{error}</Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditRestaurantModal;

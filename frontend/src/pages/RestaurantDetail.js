import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById, clearSelectedRestaurant } from '../redux/slices/restaurantSlice';
import {
  Container, Typography, Box, Grid, Paper, CircularProgress, Alert,
  Rating, Chip, Divider, Tabs, Tab, CardMedia, Button,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatTime } from '../utils/dateUtils';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedRestaurant: restaurantData,
    loadingDetail: loading,
    errorDetail: error
  } = useSelector((state) => state.restaurants);

  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
    }
    return () => {
      dispatch(clearSelectedRestaurant());
    };
  }, [dispatch, id]);

  const handleGoToBookingSearch = () => {
    navigate('/');
  };

  if (loading === 'pending') {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading restaurant details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{typeof error === 'string' ? error : 'Failed to load restaurant details.'}</Alert>
      </Container>
    );
  }

  if (!restaurantData || !restaurantData.restaurant) {
    if (loading === 'idle' && !error) {
      return (
        <Container sx={{ textAlign: 'center', py: 5 }}><Typography>Restaurant data not available.</Typography></Container>
      )
    }
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="warning">Restaurant not found or details are missing.</Alert>
      </Container>
    );
  }

  const { restaurant, noOfTimesBookedToday } = restaurantData;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ position: 'relative', height: { xs: 250, sm: 300, md: 400 }, width: '100%' }}>
          <CardMedia
            component="img"
            image={restaurant.imageUrl || 'https://via.placeholder.com/1200x400?text=Restaurant+Image'}
            alt={restaurant.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.65)',
              color: 'white',
              p: { xs: 1.5, md: 3 },
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {restaurant.name}
            </Typography>
            <Box display="flex" alignItems="center" flexWrap="wrap" columnGap={2} rowGap={0.5}>
              {restaurant.averageRating > 0 && (
                <Rating value={restaurant.averageRating} precision={0.1} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: 'warning.main' } }}/>
              )}
              <Typography variant="body2">
                ({restaurant.reviewCount} reviews)
              </Typography>
              {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mx: 0.5 }}>•</Box>
                  {restaurant.cuisines.join(', ')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Grid container>
          <Grid item xs={12} md={7} lg={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={currentTab} onChange={handleTabChange} aria-label="restaurant details tabs" variant="scrollable" scrollButtons="auto">
                <Tab label="Overview" id="restaurant-tab-0" aria-controls="restaurant-tabpanel-0" />
                <Tab label="Reviews" id="restaurant-tab-1" aria-controls="restaurant-tabpanel-1" />
              </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                About
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                {restaurant.description || 'No description available.'}
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 1.5 }}>
                Contact & Hours
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center', mb:1}}>
                  <LocationOnIcon color="action" sx={{mr:1.5, fontSize:'1.2rem'}}/>
                  <Typography variant="body2">{`${restaurant.addressStreet}, ${restaurant.addressCity}, ${restaurant.addressState} ${restaurant.addressZip}`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center', mb:1}}>
                  <PhoneIcon color="action" sx={{mr:1.5, fontSize:'1.2rem'}}/>
                  <Typography variant="body2">{restaurant.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center', mb:1}}>
                  <EmailIcon color="action" sx={{mr:1.5, fontSize:'1.2rem'}}/>
                  <Typography variant="body2">{restaurant.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:'center', mb:1}}>
                  <AccessTimeIcon color="action" sx={{mr:1.5, fontSize:'1.2rem'}}/>
                  <Typography variant="body2">
                    Hours: {restaurant.openingHour ? formatTime(restaurant.openingHour) : 'N/A'} - {restaurant.closingHour ? formatTime(restaurant.closingHour) : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Reviews for {restaurant.name}
              </Typography>
              {/* --- LATER PART --- */}
              {/* You will integrate your get reviews API call here and display the reviews. */}
              {/* For now, a placeholder: */}
              <Typography variant="body1" color="text.secondary">
                Reviews section is under construction. Review data will be displayed here soon!
                {/* Example of how you might map reviews later:
                reviewsArray.length > 0 ? (
                  reviewsArray.map(review => (
                    <Box key={review.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="subtitle2">{review.userName}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">{new Date(review.date).toLocaleDateString()}</Typography>
                      <Typography variant="body2" sx={{mt: 1}}>{review.comment}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No reviews yet for this restaurant.</Typography>
                )
                */}
              </Typography>
            </TabPanel>
            {/* Other TabPanel components */}
          </Grid>

          <Grid item xs={12} md={5} lg={4} sx={{ borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' }, p: { xs: 2, md: 3 } }}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Plan Your Visit
              </Typography>
              {noOfTimesBookedToday > 0 && (
                <Chip
                  label={`${noOfTimesBookedToday} booked today`}
                  variant="outlined"
                  color="info"
                  size="small"
                  sx={{ mb: 2, width:'100%' }}
                />
              )}
              <Typography variant="body2" color="text.secondary" paragraph>
                To make a reservation, please use the search functionality on our home page or the restaurant listings.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGoToBookingSearch}
                sx={{ mt: 1 }}
              >
                Find Tables
              </Button>
              <Divider sx={{ my: 2.5 }}>Location</Divider>
              <Box sx={{ height: 200, width: '100%', mb: 1, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
                <iframe
                  title={`${restaurant.name} Location Map`}
                  src={`https://maps.google.com/maps?q=${restaurant.coordinatesLatitude},${restaurant.coordinatesLongitude}&hl=en&z=14&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Box>
              <Typography variant="caption" display="block">
                {`${restaurant.addressStreet}, ${restaurant.addressCity}, ${restaurant.addressState} ${restaurant.addressZip}`}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RestaurantDetail;
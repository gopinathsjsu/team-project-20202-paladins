import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById, clearSelectedRestaurant } from '../redux/slices/restaurantSlice';
import {
  fetchReviewsForRestaurant,
  createReview,
  updateReview,
  deleteReview,
  resetMutationStatus,
  clearReviews,
} from '../redux/slices/reviewSlice';
import {
  Container, Typography, Box, Grid, Paper, CircularProgress, Alert as MuiAlert,
  Rating, Chip, Divider, Tabs, Tab, CardMedia, Button, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton, Pagination,
  Snackbar
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatTime } from '../utils/dateUtils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

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

// Custom Alert for Snackbar
const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RestaurantDetail = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedRestaurant: restaurantData,
    loadingDetail: loading,
    errorDetail: error
  } = useSelector((state) => state.restaurants);

  const {
    reviews,
    pagination,
    loadingState: reviewsLoading,
    error: reviewsError,
    mutationStatus,
    mutationError,
  } = useSelector((state) => state.reviews);

  const { isAuthenticated, id: currentUserId, role: currentUserRole } = useSelector((state) => state.auth);

  const [currentTab, setCurrentTab] = React.useState(0);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null); // { id, rating, comment }
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantById(restaurantId));
    }
    return () => {
      dispatch(clearSelectedRestaurant());
      dispatch(clearReviews());
    };
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (restaurantId && currentTab === 1) { // Only fetch if Reviews tab is active
      const params = { page: pagination.currentPage, size: pagination.size };
      dispatch(fetchReviewsForRestaurant({ restaurantId, params }));
    }
  }, [dispatch, restaurantId, currentTab, pagination.currentPage, pagination.size]);

  useEffect(() => {
    console.log('[Effect Review Fetch] Firing. Restaurant ID:', restaurantId, 'Current Tab:', currentTab, 'Current Page:', pagination.currentPage);
    if (restaurantId && currentTab === 1) {
      const params = { page: pagination.currentPage, size: pagination.size };
      console.log('[Effect Review Fetch] DISPATCHING fetchReviewsForRestaurant with params:', params);
      dispatch(fetchReviewsForRestaurant({ restaurantId, params }));
    } else {
      console.log('[Effect Review Fetch] NOT dispatching. Conditions not met.');
    }
  }, [dispatch, restaurantId, currentTab, pagination.currentPage, pagination.size]);

  const handleNewReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewRating || !restaurantId) {
      setSnackbarMessage('Please provide a rating.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    dispatch(createReview({ restaurantId, rating: newReviewRating, comment: newReviewComment }))
      .unwrap() // unwrap to catch promise rejection here for specific component logic
      .then(() => {
        setNewReviewRating(0);
        setNewReviewComment('');
        // Re-fetch reviews to see the new one (and ensure correct pagination/sorting)
        const params = { page: 0, size: pagination.size }; // Go to first page to see newest
        dispatch(fetchReviewsForRestaurant({ restaurantId, params }));
      })
      .catch((err) => { /* Snackbar will show error from useEffect above */ });
  };

  const handleEditReview = (review) => {
    setEditingReview({ id: review.id, rating: review.rating, comment: review.comment, restaurantId: review.restaurantId });
    // Scroll to edit form or open modal (for simplicity, inline edit below)
  };

  const handleUpdateReviewSubmit = (e) => {
    e.preventDefault();
    if (!editingReview || !editingReview.rating) {
      setSnackbarMessage('Rating is required for update.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    dispatch(updateReview({
      reviewId: editingReview.id,
      restaurantId: editingReview.restaurantId,
      rating: editingReview.rating,
      comment: editingReview.comment
    }))
      .unwrap()
      .then(() => {
        setEditingReview(null);
        // Note: Reducer already optimistically updates, re-fetch might not be needed if sorting isn't affected.
        // If sorting IS affected by rating change, re-fetch might be better.
        // For now, rely on optimistic update.
      })
      .catch((err) => { /* Snackbar handles error */ });
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDeleteId(reviewId);
    setShowConfirmDeleteDialog(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDeleteId) {
      dispatch(deleteReview(reviewToDeleteId))
        .unwrap()
        .then(() => {
          // Reducer optimistically updates. Pagination totalElements is adjusted.
          // If the current page becomes empty after deletion, you might want to fetch the previous page.
          // This logic can be complex. For now, we rely on the optimistic update.
          // If (reviews.length -1 === 0 && pagination.currentPage > 0) {
          //    dispatch(fetchReviewsForRestaurant({ restaurantId, params: {page: pagination.currentPage -1, size: pagination.size}}))
          // }
        })
        .catch((err) => { /* Snackbar handles error */ });
    }
    setShowConfirmDeleteDialog(false);
    setReviewToDeleteId(null);
  };

  const handlePageChange = (event, newPage) => {
    if (restaurantId) {
      const params = { page: newPage - 1, size: pagination.size };
      dispatch(fetchReviewsForRestaurant({ restaurantId, params }));
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
        <MuiAlert severity="error">{typeof error === 'string' ? error : 'Failed to load restaurant details.'}</MuiAlert>
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
        <MuiAlert severity="warning">Restaurant not found or details are missing.</MuiAlert>
      </Container>
    );
  }

  const { restaurant, noOfTimesBookedToday } = restaurantData || { restaurant: null };

  if (!restaurant) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <Typography>Restaurant details not available.</Typography>
      </Container>
    );
  }

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
                <Tab label={`Reviews (${restaurant.reviewCount || 0})`} id="restaurant-tab-1" aria-controls="restaurant-tabpanel-1" />
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
                Reviews
              </Typography>
              {/* --- Add Review Form (only for logged-in customers) --- */}
              {isAuthenticated && currentUserRole === 'CUSTOMER' && !editingReview && (
                <Box component="form" onSubmit={handleNewReviewSubmit} sx={{ mb: 4, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Write a Review</Typography>
                  <Rating
                    name="new-review-rating"
                    value={newReviewRating}
                    onChange={(event, newValue) => { setNewReviewRating(newValue); }}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Your Comment (optional)"
                    multiline
                    rows={3}
                    fullWidth
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={mutationStatus === 'pending' || !newReviewRating}>
                    {mutationStatus === 'pending' ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Box>
              )}

              {/* --- Edit Review Form --- */}
              {editingReview && (
                <Box component="form" onSubmit={handleUpdateReviewSubmit} sx={{ mb: 4, p: 2, border: '1px dashed blue', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Edit Your Review</Typography>
                  <Rating
                    name="edit-review-rating"
                    value={editingReview.rating}
                    onChange={(event, newValue) => { setEditingReview(prev => ({ ...prev, rating: newValue })); }}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Your Comment (optional)"
                    multiline
                    rows={3}
                    fullWidth
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" color="primary" disabled={mutationStatus === 'pending'}>
                    {mutationStatus === 'pending' ? 'Updating...' : 'Update Review'}
                  </Button>
                  <Button variant="text" onClick={() => setEditingReview(null)} sx={{ ml: 1 }}>Cancel</Button>
                </Box>
              )}
              {/* --- Display Reviews --- */}
              { (() => { // IIFE to allow console.log inside JSX easily
                console.log('[Render Reviews] reviewsLoading:', reviewsLoading);
                console.log('[Render Reviews] reviewsError:', reviewsError);
                console.log('[Render Reviews] reviews array:', reviews);
                console.log('[Render Reviews] reviews.length:', reviews?.length);
                return null; // Doesn't render anything itself
              })()}
              {reviewsLoading === 'pending' && <Box sx={{textAlign: 'center', my: 3}}><CircularProgress /></Box>}
              {reviewsError && <MuiAlert severity="error" sx={{my: 2}}>{reviewsError}</MuiAlert>}
              {reviewsLoading === 'succeeded' && reviews.length === 0 && !reviewsError && (
                <Typography sx={{my: 2}}>No reviews yet for this restaurant. Be the first to write one!</Typography>
              )}
              {reviewsLoading === 'succeeded' && reviews.length > 0 && (
                <Box>
                  {reviews.map((review) => (
                    <Paper key={review.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{review.customerName || 'Anonymous'}</Typography>
                        {/* Show Edit/Delete only if user is authenticated and is the author */}
                        {isAuthenticated && review.customerId === currentUserId && (
                          <Box>
                            <IconButton size="small" onClick={() => handleEditReview(review)} disabled={mutationStatus === 'pending' || !!editingReview}>
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteReview(review.id)} disabled={mutationStatus === 'pending'}>
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                        {new Date(review.createdAt).toLocaleDateString()} {/* Assuming 'createdAt' field */}
                      </Typography>
                      <Typography variant="body2">{review.comment}</Typography>
                    </Paper>
                  ))}
                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage + 1} // MUI Pagination is 1-indexed
                        onChange={handlePageChange}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDeleteDialog} onClose={() => setShowConfirmDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this review?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteReview} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <SnackbarAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>

    </Container>
  );
};

export default RestaurantDetail;
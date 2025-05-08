import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert as MuiAlert,
  List, ListItem, ListItemText, Divider, Paper,
  Tabs, Tab, Stack,
  Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ChairIcon from '@mui/icons-material/Chair';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import { getMyBookings, cancelBooking } from '../api/booking';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, pb: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `bookings-tab-${index}`,
    'aria-controls': `bookings-tabpanel-${index}`,
  };
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); // 0 for Upcoming, 1 for Past

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancelId, setBookingToCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error'

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookingsData = await getMyBookings();
        if (!Array.isArray(bookingsData)) {
          throw new Error("Invalid data format received.");
        }
        const sortedBookings = bookingsData.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.startSlotTime || '00:00:00'}`);
          const dateB = new Date(`${b.date}T${b.startSlotTime || '00:00:00'}`);
          if (isNaN(dateA) || isNaN(dateB)) return 0;
          return dateB - dateA;
        });
        setBookings(sortedBookings);
      } catch (err) {
        console.error("Failed to fetch bookings in component:", err);
        setError(err.message || 'Could not load your bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatBookingDateTime = (dateStr, timeStr) => {
    try {
      const timeParts = (timeStr || '00:00:00').split(':');
      const formattedTimeStr = `${timeParts[0]}:${timeParts[1]}:${timeParts[2] || '00'}`;
      const date = new Date(`${dateStr}T${formattedTimeStr}`);
      if (isNaN(date)) { throw new Error("Invalid date/time format"); }
      const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      const formattedTime = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${formattedDate} at ${formattedTime}`;
    } catch (e) {
      console.warn("Date formatting error:", e);
      return `${dateStr || 'N/A'} ${timeStr || 'N/A'}`;
    }
  };
  const getBookingStatus = (dateStr, timeStr) => {
    try {
      const timeParts = (timeStr || '00:00:00').split(':');
      const formattedTimeStr = `${timeParts[0]}:${timeParts[1]}:${timeParts[2] || '00'}`;
      const bookingDateTime = new Date(`${dateStr}T${formattedTimeStr}`);
      if (isNaN(bookingDateTime)) return 'Unknown';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return bookingDateTime >= today ? 'Upcoming' : 'Past';
    } catch (e) {
      return 'Unknown';
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCancelClick = (reservationId) => {
    if (!reservationId) {
      console.error("Cannot cancel: Missing reservationId");
      return;
    }
    setBookingToCancelId(reservationId);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    // Don't reset bookingToCancelId immediately, might be needed if cancel fails inside dialog
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancelId) return;
    setCancelLoading(true);
    setSnackbarOpen(false);

    try {
      await cancelBooking(bookingToCancelId);

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.reservationId === bookingToCancelId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      setSnackbarMessage('Booking cancelled successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseConfirm();

    } catch (err) {
      console.error("Cancellation failed:", err);
      setSnackbarMessage(err.message || 'Could not cancel booking.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      handleCloseConfirm();
    } finally {
      setCancelLoading(false);
      setBookingToCancelId(null);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const cancelledBookings = bookings.filter(b => b.status === "CANCELLED");
  const activeBookings = bookings.filter(b => b.status !== "CANCELLED");

  const upcomingBookings = activeBookings
    .filter(b => getBookingStatus(b.date, b.startSlotTime) === 'Upcoming')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startSlotTime || '00:00:00'}`);
      const dateB = new Date(`${b.date}T${b.startSlotTime || '00:00:00'}`);

      const isValidA = !isNaN(dateA.valueOf());
      const isValidB = !isNaN(dateB.valueOf());

      if (!isValidA && !isValidB) return 0;
      if (!isValidA) return 1; // Non-parsable dates go to the end for ascending
      if (!isValidB) return -1;

      return dateA - dateB; // Ascending sort for upcoming
    });
  const pastBookings = activeBookings.filter(b => getBookingStatus(b.date, b.startSlotTime) === 'Past');

  const renderBookingList = (list, type) => {
    if (list.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ p: 4 }}>
          You have no {type} bookings.
        </Typography>
      );
    }
    return (
      <List disablePadding>
        {list.map((booking, index) => (
          <React.Fragment key={`${type}-${booking.reservationId || index}`}>
            <ListItem
              alignItems="flex-start"
              sx={{
                pt: 1.5,
                pb: 1.5,
                ...(type === 'past' ? { opacity: 0.7, backgroundColor: 'action.hover' } : {})
              }}
              secondaryAction={
                type === 'upcoming' && booking.reservationId ? (
                  <IconButton
                    edge="end"
                    aria-label="cancel booking"
                    onClick={() => handleCancelClick(booking.reservationId)}
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <CancelIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="h6" component="div"
                    color={type === 'upcoming' ? 'primary.dark' : type === 'cancelled' ? 'text.disabled' : 'text.primary'}
                    sx={{
                      fontWeight: 500, mb: 1,
                      ...(type === 'cancelled' && { textDecoration: 'line-through' })
                    }}
                  >
                    {booking.restaurantName || 'Restaurant Name Missing'}
                  </Typography>
                }
                secondary={

                  <Stack spacing={0.8}> {/* Adjust spacing */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {formatBookingDateTime(booking.date, booking.startSlotTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ChairIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Table: {booking.tableNumber || 'N/A'}
                      </Typography>
                    </Box>
                    {booking.reservationId && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ConfirmationNumberIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          ID: ...{booking.reservationId.slice(-8)}
                        </Typography>
                      </Box>
                    )}
                    {type === 'cancelled' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CancelPresentationIcon fontSize="small" color="error"/>
                        <Typography variant="body2" color="error" sx={{fontWeight: 'bold'}}>
                          Cancelled
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                }
              />
              {/* <ListItemSecondaryAction> ... </ListItemSecondaryAction> */}
            </ListItem>
            {/* Use variant="middle" for inset divider, ensure it's not the last item */}
            {index < list.length - 1 && <Divider variant="middle" component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}><CircularProgress /><Typography sx={{ ml: 2 }}>Loading...</Typography></Box>;
    }
    if (error) {
      const errorMessage = error.includes("Authentication failed") || error.includes("401")
        ? `Authentication failed. You might need to log out and log back in.`
        : error;
      return <Alert severity="error" sx={{ m: 2 }}>{errorMessage}</Alert>;
    }

    if (bookings.length === 0 && !loading) {
      return <Typography variant="body1" color="text.secondary" align="center" sx={{ p: 4 }}>You haven't made any bookings yet.</Typography>;
    }

    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="booking type tabs"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<EventAvailableIcon />} iconPosition="start" label={`Upcoming (${upcomingBookings.length})`} {...a11yProps(0)} />
            <Tab icon={<HistoryIcon />} iconPosition="start" label={`Past (${pastBookings.length})`} {...a11yProps(1)} />
            <Tab icon={<CancelPresentationIcon />} iconPosition="start" label={`Cancelled (${cancelledBookings.length})`} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={selectedTab} index={0}>
          {renderBookingList(upcomingBookings, 'upcoming')}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {renderBookingList(pastBookings, 'past')}
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          {renderBookingList(cancelledBookings, 'cancelled')}
        </TabPanel>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 600 }}>
        My Bookings
      </Typography>
      {/* Render content inside the Paper */}
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {renderContent()}
      </Paper>

      <Dialog
        open={isConfirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-cancel-dialog-title"
        aria-describedby="confirm-cancel-dialog-description"
      >
        <DialogTitle id="confirm-cancel-dialog-title">
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-cancel-dialog-description">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}> {/* Add padding to actions */}
          <Button onClick={handleCloseConfirm} color="inherit" disabled={cancelLoading}>
            Keep Booking
          </Button>
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            autoFocus
            disabled={cancelLoading}
            startIcon={cancelLoading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default UserBookings;
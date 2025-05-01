import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import bookingReducer from './slices/bookingSlice';

// This is the Redux store configuration file.
// It sets up the Redux store and combines reducers if necessary.
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    booking: bookingReducer,
  },
});

export default store;

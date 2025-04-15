import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// This is the Redux store configuration file.
// It sets up the Redux store and combines reducers if necessary.
const store = configureStore({
  reducer: {
    auth: authReducer,  // auth state will live here
  },
});

export default store;

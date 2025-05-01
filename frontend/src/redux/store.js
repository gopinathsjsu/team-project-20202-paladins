import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import managerReducer from './slices/managerSlice';
import bookingReducer from './slices/bookingSlice';
import restaurantReducer from './slices/restaurantSlice';


// This is the Redux store configuration file.
// It sets up the Redux store and combines reducers if necessary.
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    manager: managerReducer,  
    booking: bookingReducer,
    restaurants: restaurantReducer,
  },
});

export default store;

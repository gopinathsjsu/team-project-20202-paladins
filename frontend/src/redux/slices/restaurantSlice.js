import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRestaurants } from '../../api/restaurant';

const initialState = {
  restaurants: [],
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async () => {
    try{
      const response = await getRestaurants();
      return response.data;
    } catch (error) {
      // If the API call fails, log the error and return an empty array
      console.error('Failed to fetch restaurants:', error.response?.data || error.message);
      return [];
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = 'pending'; // Set loading state when fetching
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export default restaurantSlice.reducer;

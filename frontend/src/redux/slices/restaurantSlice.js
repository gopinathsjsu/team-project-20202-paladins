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
    const response = await getRestaurants();
    return response;
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

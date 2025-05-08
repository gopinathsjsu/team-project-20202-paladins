import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getRestaurantById, getRestaurants} from '../../api/restaurant';

const initialState = {
  restaurants: [],
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,

  selectedRestaurant: null,
  loadingDetail: 'idle',
  errorDetail: null,
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async () => {
    const response = await getRestaurants();
    return response.data;
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchRestaurantById',
  async (id, { rejectWithValue }) => {
    try {
      return await getRestaurantById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch restaurant details');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
      state.loadingDetail = 'idle';
      state.errorDetail = null;
    }
  },
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
      })
      .addCase(fetchRestaurantById.pending, (state) => {
        state.selectedRestaurant = null; // Clear previous data on new fetch
        state.loadingDetail = 'pending';
        state.errorDetail = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loadingDetail = 'succeeded';
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loadingDetail = 'failed';
        state.errorDetail = action.payload;
      });
  },
});

export const { clearSelectedRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;

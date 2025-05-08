import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createRestaurantApi, getManagerRestaurants, updateRestaurantApi,} from "../../api/manager";

// Thunk to fetch manager's restaurants
export const fetchManagerRestaurants = createAsyncThunk(
  "manager/fetchManagerRestaurants",
  async (_, {rejectWithValue}) => {
    try {
      const response = await getManagerRestaurants();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch");
    }
  },
);

// Thunk to create a new restaurant
export const createRestaurant = createAsyncThunk(
  "manager/createRestaurant",
  async (restaurantData, {rejectWithValue}) => {
    try {
      const response = await createRestaurantApi(restaurantData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to create restaurant",
      );
    }
  },
);

export const updateRestaurant = createAsyncThunk(
  "manager/updateRestaurant",
  async (restaurantData, {rejectWithValue}) => {
    try {
      const response = await updateRestaurantApi(
        restaurantData.restaurantInput.id,
        restaurantData,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update restaurant",
      );
    }
  },
);

// Manager slice
const managerSlice = createSlice({
  name: "manager",
  initialState: {
    restaurants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Manager's Restaurants
      .addCase(fetchManagerRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchManagerRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Restaurant
      .addCase(createRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants.push(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Restaurant
      .addCase(updateRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRestaurant = action.payload;
        state.restaurants = state.restaurants.map((restaurant) =>
          restaurant.id === updatedRestaurant.id
            ? updatedRestaurant
            : restaurant,
        );
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default managerSlice.reducer;

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {approveRestaurant, deleteRestaurant, getPendingRestaurants,} from "../../api/admin";

// Thunks
export const fetchPendingRestaurants = createAsyncThunk(
  "admin/fetchPendingRestaurants",
  async (_, {rejectWithValue}) => {
    try {
      return await getPendingRestaurants();
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch");
    }
  },
);

export const approveRestaurantThunk = createAsyncThunk(
  "admin/approveRestaurant",
  async (id, {rejectWithValue}) => {
    try {
      await approveRestaurant(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to approve");
    }
  },
);

export const deleteRestaurantThunk = createAsyncThunk(
  "admin/deleteRestaurant",
  async (id, {rejectWithValue}) => {
    try {
      await deleteRestaurant(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete");
    }
  },
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    pendingRestaurants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPendingRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRestaurants = action.payload;
      })
      .addCase(fetchPendingRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve
      .addCase(approveRestaurantThunk.fulfilled, (state, action) => {
        state.pendingRestaurants = state.pendingRestaurants.filter(
          (r) => r.id !== action.payload,
        );
      })

      // Delete
      .addCase(deleteRestaurantThunk.fulfilled, (state, action) => {
        state.pendingRestaurants = state.pendingRestaurants.filter(
          (r) => r.id !== action.payload,
        );
      });
  },
});

export default adminSlice.reducer;

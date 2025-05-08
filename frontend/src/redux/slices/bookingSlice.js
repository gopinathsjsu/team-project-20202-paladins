import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {bookRestaurant} from "../../api/booking";

const initialState = {
  status: "idle",
  error: null,
  confirmation: null,
};

export const createBookingThunk = createAsyncThunk(
  "booking/create",
  async (bookingData, {rejectWithValue}) => {
    try {
      return await bookRestaurant(bookingData);
    } catch (error) {
      console.error("Thunk Error:", error);
      return rejectWithValue(
        error.response?.data || error.message || "Booking failed",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.confirmation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.confirmation = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.confirmation = action.payload; // Store the successful response data
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store the error payload from rejectWithValue
      });
  },
});

export const {resetBookingStatus} = bookingSlice.actions;

export default bookingSlice.reducer;

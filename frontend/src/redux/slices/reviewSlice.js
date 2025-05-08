import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createReviewApi, deleteReviewById, getReviewsByRestaurantId, updateReviewsById,} from "../../api/review";

const initialState = {
  reviews: [],
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
  },
  loadingState: "idle",
  error: null,

  mutationStatus: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  mutationError: null,
};

// Async Thunk to fetch reviews for a restaurant
export const fetchReviewsForRestaurant = createAsyncThunk(
  "reviews/fetchForRestaurant",
  async ({restaurantId, params}, {rejectWithValue}) => {
    try {
      return await getReviewsByRestaurantId(restaurantId, params);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch reviews");
    }
  },
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({restaurantId, rating, comment}, {rejectWithValue, getState}) => {
    const reviewData = {restaurantId, rating, comment};
    try {
      return await createReviewApi(reviewData);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create review");
    }
  },
);

// Async Thunk to update an existing review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({reviewId, restaurantId, rating, comment}, {rejectWithValue}) => {
    const reviewData = {restaurantId, rating, comment};
    try {
      return await updateReviewsById(reviewId, reviewData);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update review");
    }
  },
);

// Async Thunk to delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, {rejectWithValue}) => {
    try {
      await deleteReviewById(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete review");
    }
  },
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    resetMutationStatus: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.pagination = {
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10,
      };
      state.loadingState = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviewsForRestaurant.pending, (state) => {
        state.loadingState = "pending";
        state.error = null;
      })
      .addCase(fetchReviewsForRestaurant.fulfilled, (state, action) => {
        state.loadingState = "succeeded";
        state.reviews = action.payload.data.content || [];
        state.pagination = {
          currentPage:
            action.payload.data.number !== undefined
              ? action.payload.data.number
              : 0,
          totalPages:
            action.payload.data.totalPages !== undefined
              ? action.payload.data.totalPages
              : 0,
          totalElements:
            action.payload.data.totalElements !== undefined
              ? action.payload.data.totalElements
              : 0,
          size:
            action.payload.data.size !== undefined
              ? action.payload.data.size
              : 10,
        };
      })
      .addCase(fetchReviewsForRestaurant.rejected, (state, action) => {
        state.loadingState = "failed";
        state.error = action.payload;
      })

      // Create Review
      .addCase(createReview.pending, (state) => {
        state.mutationStatus = "pending";
        state.mutationError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })

      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.mutationStatus = "pending";
        state.mutationError = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.id,
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })

      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.mutationStatus = "pending";
        state.mutationError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload,
        );
        state.pagination.totalElements = Math.max(
          0,
          state.pagination.totalElements - 1,
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const {resetMutationStatus, clearReviews} = reviewSlice.actions;

export default reviewSlice.reducer;

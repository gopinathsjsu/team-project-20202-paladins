import axios from "./API";

/**
 * Creates a new review using the backend API.
 *
 * @param {object} reviewData - The data required to create a review.
 * @param {string} reviewData.restaurantId - ID of the restaurant being reviewed.
 * @param {string} reviewData.comment - The review comment.
 * @param {number} reviewData.rating - The rating given by the user (e.g., 1 to 5).
 * @returns {Promise<object>} The Axios promise for the API request. The resolved value will typically be the created review object or confirmation data from the backend.
 */
export const createReviewApi = async (reviewData) => {
  try {
    return await axios.post("/api/review", reviewData);
  } catch (error) {
    throw new Error(error.response?.data || "Failed to create review");
  }
};

export const updateReviewsById = async (reviewId, reviewData) => {
  try {
    return await axios.put(`/api/review/${reviewId}`, reviewData);
  } catch (error) {
    throw new Error(error.response?.data || "Failed to update review");
  }
};

export const deleteReviewById = async (reviewId) => {
  try {
    return await axios.delete(`/api/review/${reviewId}`);
  } catch (error) {
    throw new Error(error.response?.data || "Failed to delete review");
  }
};

export const getReviewsByRestaurantId = async (restaurantId, params) => {
  try {
    return await axios.get(`/api/review/restaurant/${restaurantId}`, {
      params,
    });
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch reviews");
  }
};

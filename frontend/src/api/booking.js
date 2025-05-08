import axios from "./API";

/**
 * Creates a new booking using the backend API.
 *
 * @param {object} bookingData - The data required to create the booking.
 * @param {string} bookingData.customerId - ID of the customer making the booking.
 * @param {string} bookingData.restaurantId - ID of the restaurant being booked.
 * @param {string} bookingData.tableId - ID of the specific table being booked.
 * @param {string} bookingData.startSlotTime - Start time of the slot (e.g., "15:00:00").
 * @param {string} bookingData.endSlotTime - End time of the slot (e.g., "16:00:00").
 * @param {string} bookingData.date - Date of the booking (e.g., "2019-03-27").
 * @returns {Promise<object>} The Axios promise for the API request. The resolved value will typically be the created booking object or confirmation data from the backend.
 */
export const bookRestaurant = async (bookingData) => {
  const response = await axios.post("/api/reservation/book", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axios.get("/api/reservation/my-bookings");
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axios.delete(`/api/reservation/${bookingId}`);
  return response.data;
};

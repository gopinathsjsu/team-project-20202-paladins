import axios from "./API";

export const getRestaurants = async () => {
  try {
    return await axios.get('/api/restaurant');
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch restaurants');
  }
};

export const searchRestaurant = async ({ restaurant, city, state, partySize, zip, startTime }) => {
  const params = new URLSearchParams();

  if (restaurant) params.append("restaurant", restaurant);
  if (city) params.append("city", city);
  if (state) params.append("state", state);
  if (zip) params.append("zip", zip);
  if (startTime) params.append("startTime", startTime);
  if (partySize) params.append("partySize", partySize);

  const response = await axios.get(`/api/restaurant/search?${params.toString()}`);
  return response.data;
};

export const getRestaurantById = async (id) => {
  const response = await axios.get(`/api/restaurant/${id}`);
  return response.data;
}
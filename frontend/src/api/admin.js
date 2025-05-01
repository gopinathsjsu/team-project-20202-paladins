import axios from './API'; // Axios instance with token pre-set

export const getPendingRestaurants = async () => {
  const response = await axios.get('/api/admin/pending-restaurants');
  return response.data;
};

export const approveRestaurant = async (restaurantId) => {
  const response = await axios.patch(`/api/admin/approve/${restaurantId}`);
  return response.data;
};

export const deleteRestaurant = async (restaurantId) => {
  const response = await axios.delete(`/api/restaurant/${restaurantId}`);
  return response.data;
};

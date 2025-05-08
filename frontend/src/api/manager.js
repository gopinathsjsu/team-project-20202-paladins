import axios from './API';

export const createRestaurantApi = async (restaurantData) => {
  try {
    return await axios.post('/api/restaurant', restaurantData);
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to create restaurant');
  }
};

export const getManagerRestaurants = async () => {
  try {
    return await axios.get('/api/manager/listings');
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch manager restaurants');
  }
};

export const updateRestaurantApi = async (restaurantId, restaurantData) => {
  try {
    return await axios.put(`/api/restaurant/${restaurantId}`, restaurantData);
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to update restaurant');
  }
};
import axios from './API'; 

export const createRestaurantApi = async (restaurantData) => {
  try {
    const response = await axios.post('/api/restaurant', restaurantData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to create restaurant');
  }
};

export const getManagerRestaurants = async () => {
  try {
    const response = await axios.get('/api/manager/listings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch manager restaurants');
  }
};

import axios from './API';

export const getRestaurants = async () => {
  try {
    const response = await axios.get('/api/restaurant');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch restaurants');
  }
};
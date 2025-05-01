import axios from './API';

export const getRestaurants = async () => {
  try {
    return await axios.get('/api/restaurant');
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to fetch restaurants');
  }
};
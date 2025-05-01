import API from './API';

// export const createRestaurant = async (data) => {
//   const response = await API.post('/api/restaurant', data);
//   return response.data;
// };



export const createRestaurant = async () => {
    try {
      const response = await axios.get('/api/restaurant', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch manager restaurants');
    }
  };
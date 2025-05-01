export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  RESTAURANTS: {
    LIST: '/restaurant',
    DETAIL: (id) => `/restaurant/${id}`,
    SEARCH: '/api/restaurant/search',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAIL: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
};

export const ROUTES = {
  HOME: '/',
  RESTAURANTS: '/restaurants',
  RESTAURANT_DETAIL: (id) => `/restaurants/${id}`,
  BOOKING: (restaurantId) => `/booking/${restaurantId}`,
  LOGIN: '/login',
  REGISTER: '/register',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
}; 
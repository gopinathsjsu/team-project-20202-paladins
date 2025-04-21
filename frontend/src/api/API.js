import axios from 'axios';

// Create a pre-configured Axios instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add an interceptor to attach JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;

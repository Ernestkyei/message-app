import axios from 'axios';
import useAuthStore from '../stores/authStore'; 

// TEMPORARY HARDCODE - Remove after Render works
const API_BASE = 'https://message-app-backend-api.onrender.com/api';

console.log('🔗 API Base URL:', API_BASE);

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses by logging out
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
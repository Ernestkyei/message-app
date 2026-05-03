import axios from 'axios';
import useAuthStore from '../stores/authStore'; 

const API_BASE = 'http://localhost:4000/api';

export const api = axios.create({
    baseURL: API_BASE,
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
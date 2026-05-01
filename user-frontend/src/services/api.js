import axios from 'axios';
import useAuthStore from '../stores/authStore'; 

const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
    // Try to get token from Zustand store first, then localStorage
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Optional: Handle 401 responses by logging out
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
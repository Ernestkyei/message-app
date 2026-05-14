import axios from 'axios';
import useAuthStore from '../stores/authStore'; 

// No fallback - must be set in environment
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('VITE_API_URL environment variable is not set!');
}


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
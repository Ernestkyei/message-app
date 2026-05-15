// admin-frontend/src/stores/authStore.js
import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

// Safe function to get user from localStorage
const getStoredUser = () => {
    const userStr = localStorage.getItem('user');
    
    // Check for all invalid values
    if (!userStr || userStr === 'undefined' || userStr === 'null' || userStr === '') {
        return null;
    }
    
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        // Remove corrupted data
        localStorage.removeItem('user');
        return null;
    }
};

const useAuthStore = create((set, get) => ({
    token: localStorage.getItem('token') || null,
    user: getStoredUser(),  // Use safe function instead of direct JSON.parse
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await api.post(endpoints.auth.login, { email, password });
            const { token, user } = response.data;
            
            set({ token, user, isLoading: false });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { success: true, user };
        } catch (error) {
            set({ isLoading: false });
            console.log('Full error:', error);
            console.log('Response data:', error.response?.data);
            return { success: false, error: error.response?.data?.message };
        }
    },

    logout: () => {
        set({ token: null, user: null, isLoading: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => {
        return get().token || localStorage.getItem('token');
    },
}));

export default useAuthStore;
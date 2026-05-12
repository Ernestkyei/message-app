// admin-frontend/src/stores/authStore.js
import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

const useAuthStore = create((set, get) => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
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

    // Add this getToken method to easily access token
    getToken: () => {
        return get().token || localStorage.getItem('token');
    },
}));

export default useAuthStore;
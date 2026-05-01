import { create } from 'zustand';

// Load from localStorage if available
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const useAuthStore = create((set) => ({
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,

    setUser: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        set({ user, token });
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
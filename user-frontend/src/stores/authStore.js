import { create } from 'zustand';


// Create a global auth store to manage user state across the app
const useAuthStore = create((set) => ({
    user: null,
    token: null,

    setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    }
}));

export default useAuthStore;
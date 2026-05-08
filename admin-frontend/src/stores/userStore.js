import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

const useUserStore = create((set, get) => ({
    users: [],
    selectedUser: null,
    userStats: null,
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,

    getAllUsers: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.admin.getAllUsers, {
                params: { page, limit }
            });
            
            const usersData = response.data.data || [];
            const pagination = response.data.pagination || {};
            
            set({ 
                users: usersData,
                page: pagination.page || page,
                totalPages: pagination.pages || 1,
                isLoading: false 
            });
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get All Users Error:', error);
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getUserStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.admin.getUserStats);
            
            // Your API returns: { success: true, data: { total, admins, users, recent } }
            const statsData = response.data?.data || response.data;
            
            // Format stats for dashboard - all from API, no hardcoded values
            const formattedStats = {
                total: statsData.total || 0,
                admins: statsData.admins || 0,
                users: statsData.users || 0,
                recent: statsData.recent || [],
                activeToday: statsData.activeToday || 0,
                growthPercentage: statsData.growthPercentage || '0%',
                activeGrowth: statsData.activeGrowth || '0%'
            };
            
            set({ userStats: formattedStats, isLoading: false });
            return { success: true, data: formattedStats };
        } catch (error) {
            console.error('Get User Stats Error:', error);
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getUserById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.admin.getUserById(id));
            set({ selectedUser: response.data, isLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get User By ID Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(endpoints.admin.updateUser(id), userData);
            const { users } = get();
            const updatedUsers = users.map(user => 
                user._id === id ? response.data : user
            );
            set({ users: updatedUsers, selectedUser: response.data, isLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Update User Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(endpoints.admin.deleteUser(id));
            const { users } = get();
            const filteredUsers = users.filter(user => user._id !== id);
            set({ users: filteredUsers, isLoading: false });
            return { success: true };
        } catch (error) {
            console.error('Delete User Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getUserConversationStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.admin.getUserConversationStats);
            set({ isLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get User Conversation Stats Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    broadcast: async (message, userFilters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(endpoints.admin.broadcast, { 
                message, 
                filters: userFilters 
            });
            set({ isLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Broadcast Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        users: [], 
        selectedUser: null, 
        userStats: null, 
        isLoading: false, 
        error: null,
        page: 1,
        totalPages: 1
    }),
}));

export default useUserStore;
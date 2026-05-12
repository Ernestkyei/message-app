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
            const statsData = response.data?.data || response.data;            
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
            const userData = response.data?.data || response.data;
            set({ selectedUser: userData, isLoading: false });
            return { success: true, data: userData };
        } catch (error) {
            console.error('Get User By ID Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    // FIXED: Changed from PUT to PATCH to match your backend
    updateUser: async (id, userData) => {
        set({ isLoading: true, error: null });
        try {
            // Changed from api.put to api.patch
            const response = await api.patch(endpoints.admin.updateUser(id), userData);            
            console.log('Update response:', response.data);            
            if (response.data.success) {
                const { users } = get();
                const updatedUsers = users.map(user => 
                    (user._id === id || user.id === id) 
                        ? { ...user, ...userData, ...(response.data.data || response.data.user) }
                        : user
                );
                set({ 
                    users: updatedUsers, 
                    selectedUser: response.data.data || response.data.user,
                    isLoading: false 
                });
                return { success: true, data: response.data.data || response.data.user };
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update User Error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update user';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.delete(endpoints.admin.deleteUser(id));
            if (response.data.success) {
                const { users } = get();
                const filteredUsers = users.filter(user => user._id !== id && user.id !== id);
                set({ users: filteredUsers, isLoading: false });
                return { success: true };
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete User Error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to delete user';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
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
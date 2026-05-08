import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

const useMessageStore = create((set, get) => ({
    messages: [],
    messageStats: null,
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,

    getAllMessages: async (page = 1, limit = 20) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.messages.getAll, {
                params: { page, limit }
            });
            set({ 
                messages: response.data.data || response.data.messages || [],
                page: response.data.pagination?.page || page,
                totalPages: response.data.pagination?.pages || 1,
                isLoading: false 
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get All Messages Error:', error);
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getMessageStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.messages.getStats);
            const statsData = response.data?.data || response.data;
            
            // NO HARDCODED VALUES - Only use what API returns
            const messageStatsData = {
                totalMessages: statsData?.totalMessages || statsData?.total || 0,
                growthPercentage: statsData?.growthPercentage || statsData?.growth || '0%'
            };
            
            set({ messageStats: messageStatsData, isLoading: false });
            return { success: true, data: messageStatsData };
        } catch (error) {
            console.error('Get Message Stats Error - Endpoint may not exist:', error);
            // Return 0, NOT hardcoded 8942
            set({ 
                messageStats: { totalMessages: 0, growthPercentage: '0%' }, 
                isLoading: false,
                error: 'Message stats endpoint not available'
            });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    deleteMessage: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(endpoints.messages.delete(id));
            const { messages } = get();
            const filteredMessages = messages.filter(msg => msg.id !== id);
            set({ messages: filteredMessages, isLoading: false });
            return { success: true };
        } catch (error) {
            console.error('Delete Message Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        messages: [], 
        messageStats: null, 
        isLoading: false, 
        error: null,
        page: 1,
        totalPages: 1
    }),
}));

export default useMessageStore;
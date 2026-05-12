import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

const useMessageStore = create((set, get) => ({
    messages: [],
    messageStats: {
        totalMessages: 0,
        totalConversations: 0,
        unreadMessages: 0,
        growthPercentage: '0%',
        totalPages: 1
    },
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
            
            console.log('📨 Messages API Response:', response.data);
            
            let messagesData = [];
            let paginationData = {};
            
            if (response.data?.data?.data) {
                messagesData = response.data.data.data;
                paginationData = response.data.data.pagination || {};
            } else if (response.data?.data) {
                messagesData = response.data.data;
                paginationData = response.data.pagination || {};
            } else if (response.data?.messages) {
                messagesData = response.data.messages;
                paginationData = response.data.pagination || {};
            } else if (Array.isArray(response.data)) {
                messagesData = response.data;
            }
            
            set({ 
                messages: messagesData,
                page: paginationData.page || page,
                totalPages: paginationData.pages || paginationData.totalPages || 1,
                isLoading: false 
            });
            
            return { success: true, data: { data: messagesData, pagination: paginationData } };
        } catch (error) {
            console.error('❌ Get All Messages Error:', error);
            console.error('Error details:', error.response?.data);
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getMessageStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.messages.getStats);
            
            console.log('📊 Stats API Response:', response.data);
            console.log('📊 Stats Endpoint URL:', endpoints.messages.getStats);
            
            // Try to extract stats from various possible response structures
            let statsData = {};
            
            if (response.data?.data) {
                statsData = response.data.data;
            } else if (response.data) {
                statsData = response.data;
            }
            
            // Extract values with fallbacks
            const messageStatsData = {
                totalMessages: statsData?.totalMessages || statsData?.total || statsData?.count || 0,
                totalConversations: statsData?.totalConversations || statsData?.conversations || statsData?.conversationCount || 0,
                unreadMessages: statsData?.unreadMessages || statsData?.unread || statsData?.unreadCount || 0,
                growthPercentage: statsData?.growthPercentage || statsData?.growth || '0%',
                totalPages: statsData?.totalPages || 1
            };
            
            console.log('📊 Processed Stats Data:', messageStatsData);
            
            set({ messageStats: messageStatsData, isLoading: false });
            return { success: true, data: messageStatsData };
        } catch (error) {
            console.error('❌ Get Message Stats Error:', error);
            console.error('Error details:', error.response?.data);
            // Return default stats instead of failing
            set({ 
                messageStats: { 
                    totalMessages: 0, 
                    totalConversations: 0, 
                    unreadMessages: 0,
                    growthPercentage: '0%',
                    totalPages: 1
                }, 
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
            const filteredMessages = messages.filter(msg => (msg._id || msg.id) !== id);
            set({ messages: filteredMessages, isLoading: false });
            return { success: true };
        } catch (error) {
            console.error('❌ Delete Message Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        messages: [], 
        messageStats: { 
            totalMessages: 0, 
            totalConversations: 0, 
            unreadMessages: 0,
            growthPercentage: '0%',
            totalPages: 1
        }, 
        isLoading: false, 
        error: null,
        page: 1,
        totalPages: 1
    }),
}));

export default useMessageStore;
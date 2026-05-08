import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';

const useConversationStore = create((set, get) => ({
    conversations: [],
    selectedConversation: null,
    isLoading: false,
    error: null,
    page: 1,
    totalPages: 1,

    getAllConversations: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.conversations.getAll, {
                params: { page, limit }
            });
            
            set({ 
                conversations: response.data?.data || [],
                page: response.data?.pagination?.page || page,
                totalPages: response.data?.pagination?.pages || 1,
                isLoading: false 
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get All Conversations Error:', error);
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getConversationById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(endpoints.conversations.getById(id));
            set({ selectedConversation: response.data, isLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get Conversation By ID Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    deleteConversation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(endpoints.conversations.delete(id));
            const { conversations } = get();
            const filteredConversations = conversations.filter(conv => conv.id !== id);
            set({ conversations: filteredConversations, isLoading: false });
            return { success: true };
        } catch (error) {
            console.error('Delete Conversation Error:', error);
            set({ error: error.response?.data?.message, isLoading: false });
            return { success: false, error: error.response?.data?.message };
        }
    },

    clearError: () => set({ error: null }),
    
    reset: () => set({ 
        conversations: [], 
        selectedConversation: null, 
        isLoading: false, 
        error: null,
        page: 1,
        totalPages: 1
    }),
}));

export default useConversationStore;
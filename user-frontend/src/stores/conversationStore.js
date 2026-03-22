import { create } from 'zustand';
import api from '@/services/api';

const useConversationStore = create((set) => ({
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,

    // Get all conversations
    fetchConversations: async () => {
        set({ loading: true });
        try {
            const { data } = await api.get('/conversations');
            set({ conversations: data.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
        }
    },

    // Set active conversation
    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation });
    },

    // Create a new conversation
    createConversation: async (receiverId) => {
        try {
            const { data } = await api.post('/conversations', { receiverId });
            set((state) => ({ conversations: [data.data, ...state.conversations] }));
            return data.data;
        } catch (err) {
            set({ error: err.response?.data?.message });
        }
    },

    // Clear active conversation
    clearActiveConversation: () => set({ activeConversation: null }),
}));

export default useConversationStore;
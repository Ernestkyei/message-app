import { create } from 'zustand';
import api from '@/services/api';

const useMessageStore = create((set) => ({
    messages: [],
    loading: false,
    error: null,

    // Get all messages in a conversation
    fetchMessages: async (conversationId) => {
        set({ loading: true });
        try {
            const { data } = await api.get(`/messages/conversations/${conversationId}/messages`);
            set({ messages: data.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
        }
    },

    // Send a message
    sendMessage: async (conversationId, content) => {
        try {
            const { data } = await api.post(`/messages/conversations/${conversationId}/messages`, { content });
            set((state) => ({ messages: [...state.messages, data.data] }));
        } catch (err) {
            set({ error: err.response?.data?.message });
        }
    },

    // Delete a message
    deleteMessage: async (messageId) => {
        try {
            await api.delete(`/messages/messages/${messageId}`);
            set((state) => ({
                messages: state.messages.filter(m => m._id !== messageId)
            }));
        } catch (err) {
            set({ error: err.response?.data?.message });
        }
    },

    // Clear messages
    clearMessages: () => set({ messages: [] }),
}));

export default useMessageStore;
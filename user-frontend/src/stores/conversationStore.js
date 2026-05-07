import { create } from 'zustand';
import api from '@/services/api';
import endpoints from '@/config/endpoints/endpoints';  

const useConversationStore = create((set) => ({
    conversations: [],
    activeConversation: null,
    loading: false,
    error: null,

    // Get all conversations
    fetchConversations: async () => {
        set({ loading: true });
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.get(endpoints.conversations.getAll);
            set({ conversations: data.data || data, loading: false });
            return data.data || data;
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
            throw err;
        }
    },

    // Get single conversation by ID
    getConversation: async (conversationId) => {
        set({ loading: true });
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.get(endpoints.conversations.getById(conversationId));
            const conversation = data.data || data;
            set({ activeConversation: conversation, loading: false });
            return conversation;
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
            throw err;
        }
    },

    // Create a new conversation
    createConversation: async (participantId, type = 'direct') => {
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.post(endpoints.conversations.create, { 
                participantId, 
                type 
            });
            const newConversation = data.data || data;
            set((state) => ({ 
                conversations: [newConversation, ...state.conversations] 
            }));
            return newConversation;
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Update conversation
    updateConversation: async (conversationId, updates) => {
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.put(endpoints.conversations.update(conversationId), updates);
            const updatedConversation = data.data || data;
            set((state) => ({
                conversations: state.conversations.map(conv =>
                    conv._id === conversationId ? updatedConversation : conv
                ),
                activeConversation: state.activeConversation?._id === conversationId 
                    ? updatedConversation 
                    : state.activeConversation
            }));
            return updatedConversation;
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Delete conversation
    deleteConversation: async (conversationId) => {
        try {
            // ✅ Using your endpoint structure
            await api.delete(endpoints.conversations.delete(conversationId));
            set((state) => ({
                conversations: state.conversations.filter(c => c._id !== conversationId),
                activeConversation: state.activeConversation?._id === conversationId 
                    ? null 
                    : state.activeConversation
            }));
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Get conversation participants
    getParticipants: async (conversationId) => {
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.get(endpoints.conversations.getParticipants(conversationId));
            return data.data || data;
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Add participant to conversation
    addParticipant: async (conversationId, userId) => {
        try {
            // ✅ Using your endpoint structure
            const { data } = await api.post(endpoints.conversations.addParticipant(conversationId), { userId });
            const updatedConversation = data.data || data;
            set((state) => ({
                conversations: state.conversations.map(conv =>
                    conv._id === conversationId ? updatedConversation : conv
                )
            }));
            return updatedConversation;
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Remove participant from conversation
    removeParticipant: async (conversationId, userId) => {
        try {
            // ✅ Using your endpoint structure
            await api.delete(endpoints.conversations.removeParticipant(conversationId, userId));
            const { data } = await api.get(endpoints.conversations.getById(conversationId));
            const updatedConversation = data.data || data;
            set((state) => ({
                conversations: state.conversations.map(conv =>
                    conv._id === conversationId ? updatedConversation : conv
                )
            }));
            return updatedConversation;
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Leave conversation
    leaveConversation: async (conversationId) => {
        try {
            // ✅ Using your endpoint structure
            await api.post(endpoints.conversations.leave(conversationId));
            set((state) => ({
                conversations: state.conversations.filter(c => c._id !== conversationId),
                activeConversation: state.activeConversation?._id === conversationId 
                    ? null 
                    : state.activeConversation
            }));
        } catch (err) {
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // Set active conversation
    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation });
    },

    // Clear active conversation
    clearActiveConversation: () => set({ activeConversation: null }),
}));

export default useConversationStore;
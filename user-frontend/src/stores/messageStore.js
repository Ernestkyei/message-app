import { create } from 'zustand';
import api from '@/services/api';
import endpoints from '@/config/endpoints/endpoints';  
import websocketService from '@/services/websocket';

const useMessageStore = create((set, get) => ({
    messages: [],
    loading: false,
    error: null,
    onlineUsers: [],
    totalUnreadCount: 0,
    activeConversationId: null,

    initWebSocket: () => {
        websocketService.on('newMessage', (messageData) => {
            const message = messageData.data || messageData;
            console.log('📨 New message via WebSocket:', message);
            
            set((state) => {
                const messageExists = state.messages.some(m => m._id === message._id);
                if (!messageExists) {
                    return { messages: [...state.messages, message] };
                }
                return state;
            });
            
            const { activeConversationId } = get();
            if (activeConversationId !== message.conversation) {
                set((state) => ({ 
                    totalUnreadCount: state.totalUnreadCount + 1 
                }));
            }
        });
        
        websocketService.on('unreadCountUpdate', (data) => {
            console.log('📬 Unread count update:', data);
        });
        
        websocketService.on('userConnected', (data) => {
            set({ onlineUsers: data.onlineUsers || [] });
        });
        
        websocketService.on('userDisconnected', (data) => {
            set({ onlineUsers: data.onlineUsers || [] });
        });
    },

    fetchTotalUnreadCount: async () => {
        try {
            const { data } = await api.get(endpoints.messages.getTotalUnread);
            set({ totalUnreadCount: data.data?.totalUnread || 0 });
            return data.data?.totalUnread || 0;
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
            return 0;
        }
    },

    // Get all messages in a conversation
    fetchMessages: async (conversationId) => {
        set({ loading: true, activeConversationId: conversationId });
        try {
            const url = endpoints.messages.getMessages(conversationId);
            const { data } = await api.get(url);
            const messages = data.data || data;
            
            const uniqueMessages = Array.from(
                new Map(messages.map(msg => [msg._id, msg])).values()
            );
            
            set({ messages: uniqueMessages, loading: false });
            return uniqueMessages;
        } catch (err) {
            console.error('Fetch messages error:', err);
            set({ error: err.response?.data?.message, loading: false, messages: [] });
            throw err;
        }
    },

    // Send a message
    sendMessage: async (conversationId, content) => {
        try {
            const url = endpoints.messages.send.replace(':conversationId', conversationId);
            const { data } = await api.post(url, { content });
            const newMessage = data.data || data;
            
            set((state) => {
                const messageExists = state.messages.some(m => m._id === newMessage._id);
                if (!messageExists) {
                    return { messages: [...state.messages, newMessage] };
                }
                return state;
            });
            return newMessage;
        } catch (err) {
            console.error('Send message error:', err);
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // ✅ Permanent delete (only for message owner)
    deleteMessage: async (messageId) => {
        try {
            const url = endpoints.messages.deleteMessage(messageId);
            await api.delete(url);
            set((state) => ({
                messages: state.messages.filter(m => m._id !== messageId && m.id !== messageId)
            }));
        } catch (err) {
            console.error('Delete message error:', err);
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // ✅ NEW - Hide message for current user (soft delete)
    hideMessage: async (messageId) => {
        try {
            const url = endpoints.messages.hideMessage(messageId);
            await api.delete(url);
            // Remove from local state immediately
            set((state) => ({
                messages: state.messages.filter(m => m._id !== messageId && m.id !== messageId)
            }));
            return true;
        } catch (err) {
            console.error('Hide message error:', err);
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    // ✅ NEW - Unhide a message (restore hidden message)
    unhideMessage: async (messageId) => {
        try {
            const url = endpoints.messages.unhideMessage(messageId);
            const { data } = await api.patch(url);
            return data;
        } catch (err) {
            console.error('Unhide message error:', err);
            set({ error: err.response?.data?.message });
            throw err;
        }
    },

    markAsRead: async (conversationId) => {
        try {
            const url = endpoints.messages.markAsRead(conversationId);
            const { data } = await api.patch(url);
            set({ totalUnreadCount: 0 });
            return data;
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    },

    addMessage: (message) => {
        set((state) => {
            const messageExists = state.messages.some(m => m._id === message._id);
            if (!messageExists) {
                return { messages: [...state.messages, message] };
            }
            return state;
        });
    },

    clearMessages: () => set({ messages: [], activeConversationId: null, totalUnreadCount: 0 }),

    isUserOnline: (userId) => {
        const { onlineUsers } = get();
        return onlineUsers.includes(userId);
    },
}));

export default useMessageStore;
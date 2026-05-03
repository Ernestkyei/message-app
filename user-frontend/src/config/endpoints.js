const API_BASE = 'http://localhost:4000/api';

export const endpoints = {
    auth: {
        register: `${API_BASE}/auth/register`,
        login: `${API_BASE}/auth/login`,
        logout: `${API_BASE}/auth/logout`,
        forgotPassword: `${API_BASE}/auth/forgot-password`,
        resetPassword: (token) => `${API_BASE}/auth/reset-password/${token}`,
    },
    user: {
        getMe: `${API_BASE}/users/me`,
        updateMe: `${API_BASE}/users/me`,
        changePassword: `${API_BASE}/users/change-password`,
    },
    messages: {
        send: `${API_BASE}/messages`,
        getConversations: `${API_BASE}/messages/conversations`,
        getMessages: (conversationId) => `${API_BASE}/messages/${conversationId}`,
        deleteMessage: (id) => `${API_BASE}/messages/${id}`,
        markAsRead: (conversationId) => `${API_BASE}/messages/${conversationId}/read`,
    },
    conversations: {
        getAll: `${API_BASE}/conversations`,
        getById: (id) => `${API_BASE}/conversations/${id}`,
        create: `${API_BASE}/conversations`,
        update: (id) => `${API_BASE}/conversations/${id}`,
        delete: (id) => `${API_BASE}/conversations/${id}`,
        getParticipants: (id) => `${API_BASE}/conversations/${id}/participants`,
        addParticipant: (id) => `${API_BASE}/conversations/${id}/participants`,
        removeParticipant: (id, userId) => `${API_BASE}/conversations/${id}/participants/${userId}`,
        leave: (id) => `${API_BASE}/conversations/${id}/leave`,
    },
};

export default endpoints;
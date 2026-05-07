// src/config/endpoints/endpoints.js
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
        getAll: `${API_BASE}/users`,           // ✅ ADD THIS for regular users list
        getAllUsers: `${API_BASE}/users/all`,  // This one gets ALL users including admins
    },
    messages: {
        send: `${API_BASE}/conversations/:conversationId/messages`,
        getMessages: (conversationId) => `${API_BASE}/conversations/${conversationId}/messages`,
        markAsRead: (conversationId) => `${API_BASE}/conversations/${conversationId}/read`,
        getTotalUnread: `${API_BASE}/conversations/unread/count`,
        deleteMessage: (id) => `${API_BASE}/conversations/messages/${id}`,      
        hideMessage: (id) => `${API_BASE}/conversations/messages/${id}/hide`,  
        unhideMessage: (id) => `${API_BASE}/conversations/messages/${id}/unhide`, 
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
const API_BASE = 'http://localhost:4000/api';

const endpoints = {
  // ========== AUTHENTICATION ==========
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
  },

  // ========== ADMIN USER MANAGEMENT ==========
  admin: {
    getAllUsers: `${API_BASE}/admin/users`,
    getUserStats: `${API_BASE}/admin/user/stats`,
    getUserById: (id) => `${API_BASE}/admin/user/${id}`,
    updateUser: (id) => `${API_BASE}/admin/user/${id}`,
    deleteUser: (id) => `${API_BASE}/admin/user/${id}`,
    getUserConversationStats: `${API_BASE}/admin/users/conversation-stats`,
  },

  // ========== ADMIN CONVERSATION MANAGEMENT ==========
  conversations: {
    getAll: `${API_BASE}/admin/conversations`,                    
    getById: (id) => `${API_BASE}/admin/conversations/${id}`,    
    delete: (id) => `${API_BASE}/admin/conversations/${id}`,     
  },

  // ========== ADMIN MESSAGE MODERATION ==========
  messages: {
    getAll: `${API_BASE}/admin/messages`,
    getStats: `${API_BASE}/admin/messages/stats`,
    delete: (id) => `${API_BASE}/admin/messages/${id}`,
  },
};

export default endpoints;
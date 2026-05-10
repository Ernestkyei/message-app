const endpoints = {
    // ========== AUTHENTICATION ==========
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        forgotPassword: '/auth/forgot-password',
        resetPassword: (token) => `/auth/reset-password/${token}`,
        changePassword: '/auth/change-password',
    },

    // ========== ADMIN USER MANAGEMENT ==========
    admin: {
        getAllUsers: '/admin/users',
        getUserStats: '/admin/user/stats',  
        getUserById: (id) => `/admin/user/${id}`,  
        updateUser: (id) => `/admin/user/${id}`,   
        deleteUser: (id) => `/admin/user/${id}`,   
        getUserConversationStats: '/admin/users/conversation-stats',
        broadcast: '/admin/broadcast',
        dashboard: '/admin/dashboard',        
        health: '/admin/health',              
        activityLog: '/admin/activity-log',  
        settings: '/admin/settings',          
    },

    // ========== ADMIN CONVERSATION MANAGEMENT ==========
    conversations: {
        getAll: '/admin/conversations',
        getById: (id) => `/admin/conversations/${id}`,
        delete: (id) => `/admin/conversations/${id}`,
    },

    // ========== ADMIN MESSAGE MODERATION ==========
    messages: {
        getAll: '/admin/messages',
        getStats: '/admin/messages/stats',
        delete: (id) => `/admin/messages/${id}`,
    },

    // ========== ADMIN ANALYTICS ==========
    analytics: {
        getSystemAnalytics: '/admin/analytics',
    },
};

export default endpoints;
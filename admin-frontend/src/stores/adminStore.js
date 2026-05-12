import { create } from 'zustand';
import api from '../service/api';
import endpoints from '../endpoints/endpoints';
import toast from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
    dashboardData: null,
    adminLoading: false,
    adminError: null,

    loadDashboard: async () => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.admin.dashboard);
            set({ dashboardData: response.data, adminLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getDashboardStats: async () => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.conversations.getAll, { 
                params: { page: 1, limit: 1 } 
            });
            
            const dashboardStats = {
                totalConversations: response.data?.pagination?.total || 0,
                conversationsGrowth: response.data?.growth || '0%'
            };
            
            set({ dashboardData: dashboardStats, adminLoading: false });
            return { success: true, data: dashboardStats };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getSystemAnalytics: async (params = {}) => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.analytics.getSystemAnalytics, { params });
            console.log('Raw analytics response:', response.data);
            
            const analyticsData = response.data?.data || response.data;
            
            set({ adminLoading: false });
            return { success: true, data: analyticsData };
        } catch (error) {
            console.error('Analytics endpoint error:', error);
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getSystemHealth: async () => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.admin.health);
            set({ adminLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getAdminActivityLog: async (page = 1, limit = 50) => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.admin.activityLog, {
                params: { page, limit }
            });
            set({ adminLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    getSystemSettings: async () => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.get(endpoints.admin.settings);
            set({ adminLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    updateSystemSettings: async (settings) => {
        set({ adminLoading: true, adminError: null });
        try {
            const response = await api.put(endpoints.admin.settings, settings);
            set({ adminLoading: false });
            return { success: true, data: response.data };
        } catch (error) {
            set({ 
                adminError: error.response?.data?.message || error.message,
                adminLoading: false 
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    // ========== DIRECT MESSAGING (1-on-1) ==========
    sendDirectMessage: async (userId, message, subject = '') => {
        set({ adminLoading: true, adminError: null });
        try {
            // UPDATED: Using the correct endpoint from endpoints.js
            const response = await api.post(endpoints.admin.sendMessage, {
                userId,
                message,
                subject
            });
            set({ adminLoading: false });
            toast.success(response.data.message || 'Message sent successfully!');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Send message error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to send message';
            set({ adminError: errorMsg, adminLoading: false });
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    },

    clearAdminError: () => set({ adminError: null }),
    
    resetAdmin: () => set({
        dashboardData: null,
        adminLoading: false,
        adminError: null
    }),
}));

export default useAdminStore;
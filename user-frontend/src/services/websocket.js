import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.onlineUsers = [];
        this.isConnected = false;
        this.currentUserId = null;
    }

    connect(token) {
        if (this.socket && this.socket.connected) {
            console.log('WebSocket already connected');
            return;
        }

        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                this.currentUserId = payload.id || payload._id || payload.userId;
                console.log('✅ Current user ID:', this.currentUserId);
            }
        } catch (e) {
            console.warn('Could not extract user ID from token');
        }

        this.socket = io('http://localhost:4000', {
            query: { token },
            transports: ['websocket'],
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.isConnected = true;
            this.emit('connect');
            this.emit('statusChange', { online: true });
            
            setTimeout(() => {
                this.socket.emit('getOnlineUsers');
            }, 500);
        });

        this.socket.on('newMessage', (data) => {
            console.log('📨📨📨 NEW MESSAGE RECEIVED IN WEBSOCKET SERVICE:', data);
            this.emit('newMessage', data);
        });

        this.socket.on('messageSent', (data) => {
            console.log('✅ Message sent confirmation:', data);
            this.emit('messageSent', data);
        });

        this.socket.on('userConnected', (data) => {
            console.log(`🟢 User connected: ${data.userId}`);
            this.onlineUsers = data.onlineUsers || [];
            this.emit('userConnected', data);
        });

        this.socket.on('userDisconnected', (data) => {
            console.log(`🔴 User disconnected: ${data.userId}`);
            this.onlineUsers = data.onlineUsers || [];
            this.emit('userDisconnected', data);
        });

        this.socket.on('onlineUsersList', (data) => {
            console.log('📋 Online users list received:', data.onlineUsers);
            this.onlineUsers = data.onlineUsers || [];
            this.emit('onlineUsersList', data);
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected');
            this.isConnected = false;
            this.onlineUsers = [];
            this.emit('disconnect');
            this.emit('statusChange', { online: false });
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.emit('error', error);
        });
    }

    sendMessage(conversationId, content) {
        if (this.socket && this.socket.connected) {
            console.log(`📤 Sending message via WebSocket:`, { conversationId, content });
            this.socket.emit('sendMessage', { conversationId, content });
        } else {
            console.error('WebSocket not connected');
        }
    }

    refreshOnlineUsers() {
        if (this.socket && this.socket.connected) {
            console.log('🔄 Refreshing online users...');
            this.socket.emit('getOnlineUsers');
        }
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            if (callback) {
                const filtered = this.listeners.get(event).filter(cb => cb !== callback);
                this.listeners.set(event, filtered);
            } else {
                this.listeners.delete(event);
            }
        }
    }

    isCurrentUserOnline() {
        return this.isConnected;
    }

    isUserOnline(userId) {
        return this.onlineUsers.includes(userId);
    }

    getOnlineUsers() {
        return this.onlineUsers;
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.onlineUsers = [];
            this.currentUserId = null;
        }
    }
}

export default new WebSocketService();
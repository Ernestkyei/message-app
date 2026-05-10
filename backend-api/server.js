const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './config/config.env' });

const app = require('./app');
const connectDb = require('./config/db');
const Message = require('./models/messageModel');
const Conversation = require('./models/conversationModel');
const User = require('./models/userModel');

// Import adminService to set online users
const adminService = require('./services/adminService');

// ==================== INITIALIZATION ====================
connectDb();

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// ==================== SOCKET.IO SETUP ====================
const io = socketIO(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
        credentials: true
    }
});

app.set('io', io);

// ==================== STORAGE ====================
const onlineUsers = new Map();

// ==================== SET ONLINE USERS IN ADMIN SERVICE ====================
// This makes onlineUsers available to adminService for isOnline field
adminService.setOnlineUsers(onlineUsers);

// ==================== AUTHENTICATION MIDDLEWARE ====================
io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.userId = decoded.id;
        next();
    });
});

// ==================== CONNECTION HANDLER ====================
io.on('connection', (socket) => {
    const userId = socket.userId;

    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`User connected: ${userId} (${onlineUsers.size} online)`);

    socket.emit('onlineUsersList', { onlineUsers: Array.from(onlineUsers.keys()) });
    socket.broadcast.emit('userConnected', { userId, onlineUsers: Array.from(onlineUsers.keys()) });

    socket.on('getOnlineUsers', () => {
        socket.emit('onlineUsersList', { onlineUsers: Array.from(onlineUsers.keys()) });
    });

    socket.on('sendMessage', async (data) => {
        try {
            const { conversationId, content } = data;
            console.log(`Message from ${userId} to conversation ${conversationId}`);

            const message = await Message.create({
                conversation: conversationId,
                sender: userId,
                content,
                read: false
            });

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                socket.emit('messageError', { error: 'Conversation not found' });
                return;
            }

            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'name email avatar');

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: message._id,
                lastMessageText: content,
                lastMessageTime: new Date()
            });

            const participants = conversation.participants.map(p => p.toString());
            participants.forEach(participantId => {
                io.to(`user_${participantId}`).emit('newMessage', { success: true, data: populatedMessage });
            });

            console.log(`✅ Message sent to ${participants.length} participants`);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('messageError', { success: false, error: error.message });
        }
    });

    socket.on('markAsRead', async (data) => {
        try {
            const { conversationId } = data;
            await Message.updateMany(
                { conversation: conversationId, sender: { $ne: userId }, read: false },
                { read: true }
            );
            console.log(`📖 ${userId} read messages in ${conversationId}`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        console.log(`User disconnected: ${userId} (${onlineUsers.size} online)`);
        socket.broadcast.emit('userDisconnected', { userId, onlineUsers: Array.from(onlineUsers.keys()) });
    });
});

// ==================== API ROUTES ====================
app.get('/api/online-users', (req, res) => {
    res.json({ success: true, onlineUsers: Array.from(onlineUsers.keys()) });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// ==================== START SERVER ====================
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket ready at ws://localhost:${PORT}`);
    console.log(`✅ CORS enabled for: ${process.env.ALLOWED_ORIGINS}\n`);
});
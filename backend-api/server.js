const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './config/config.env' });

const app = require('./app');
const connectDb = require('./config/db');

connectDb();

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

app.set('io', io);

const onlineUsers = new Map();

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

io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.userId);
    
    onlineUsers.set(socket.userId, socket.id);
    
    socket.broadcast.emit('userConnected', {
        userId: socket.userId,
        onlineUsers: Array.from(onlineUsers.keys())
    });
    
    socket.emit('onlineUsersList', {
        onlineUsers: Array.from(onlineUsers.keys())
    });
    
    socket.join(socket.userId);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit('userDisconnected', {
            userId: socket.userId,
            onlineUsers: Array.from(onlineUsers.keys())
        });
    });
});

app.get('/api/online-users', (req, res) => {
    res.json({
        success: true,
        onlineUsers: Array.from(onlineUsers.keys())
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(` WebSocket server ready`);
});
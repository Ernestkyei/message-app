const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');
const errorHandle = require('./middlewares/errorHandle');
const conversationRoutes = require('./routes/conversationRoute');
const messageRoutes = require('./routes/messageRoute');

const app = express();

// middlewares
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/conversations', messageRoutes);

// health check route
app.get('/health', (req, res) => {
    res.json({ status: 'Backend API is running' });
});

app.use(errorHandle);
module.exports = app;
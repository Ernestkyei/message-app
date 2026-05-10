const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const ApiError = require('../utils/apiError');

// Store online users (will be set from server.js)
let onlineUsersMap = new Map();

// Function to set online users from server
exports.setOnlineUsers = (onlineUsers) => {
    onlineUsersMap = onlineUsers;
};

// ========== USER MANAGEMENT ==========

// Get all users with pagination
exports.getAllUsers = async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (queryParams.role) filter.role = queryParams.role;    
    // Search
    if (queryParams.search) {
        filter.$or = [
            { name: { $regex: queryParams.search, $options: 'i' } },
            { email: { $regex: queryParams.search, $options: 'i' } }
        ];
    }
    
    const users = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort(queryParams.sort || '-createdAt');
    
    // Add isOnline field to each user
    const usersWithStatus = users.map(user => {
        const userObj = user.toObject();
        userObj.isOnline = onlineUsersMap.has(user._id.toString());
        return userObj;
    });
    
    const total = await User.countDocuments(filter);    
    return {
        users: usersWithStatus,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

// Get user by ID
exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const userObj = user.toObject();
    userObj.isOnline = onlineUsersMap.has(user._id.toString());
    return userObj;
};

// Update user (admin)
exports.updateUser = async (userId, data) => {
    const allowedFields = ['name', 'email', 'role', 'status'];
    const user = await User.findById(userId);    
    if (!user) {
        throw new ApiError(404, 'User not found');
    }    
    // Only iterate over keys present in the input data
    Object.keys(data).forEach(field => {
        // Check if the field is allowed and the value is not undefined
        if (allowedFields.includes(field) && data[field] !== undefined) user[field] = data[field];
    });

    await user.save();
    user.password = undefined;
    const userObj = user.toObject();
    userObj.isOnline = onlineUsersMap.has(user._id.toString());
    return userObj;
};

// ========== ANALYTICS FOR CHARTS ==========

exports.getSystemAnalytics = async (queryParams) => {
    const days = parseInt(queryParams.days) || 7;
    
    console.log('=== ANALYTICS DEBUG ===');
    console.log('Fetching analytics for last', days, 'days');
    
    // Check total messages in database
    const totalMessagesInDb = await Message.countDocuments();
    console.log('Total messages in database:', totalMessagesInDb);
    
    // Get messages per day for the last {days} days
    const messagesPerDay = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const messageCount = await Message.countDocuments({
            createdAt: { $gte: date, $lt: nextDate }
        });
        
        const activeUserCount = await User.countDocuments({
            lastActive: { $gte: date, $lt: nextDate }
        });
        
        console.log(`${date.toLocaleDateString()}: Messages=${messageCount}, ActiveUsers=${activeUserCount}`);
        
        messagesPerDay.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            messages: messageCount,
            users: activeUserCount
        });
    }
    
    // Get active vs inactive users (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const activeUsers = await User.countDocuments({
        lastActive: { $gte: last30Days }
    });
    
    const totalUsers = await User.countDocuments();
    const inactiveUsers = totalUsers - activeUsers;
    
    console.log('Total Users:', totalUsers);
    console.log('Active Users (last 30 days):', activeUsers);
    console.log('Inactive Users:', inactiveUsers);
    
    // Get top users by message count
    const topUsers = await Message.aggregate([
        {
            $group: {
                _id: '$sender',
                messageCount: { $sum: 1 }
            }
        },
        {
            $sort: { messageCount: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                name: '$user.name',
                messages: '$messageCount'
            }
        }
    ]);
    
    console.log('Top Users by Messages:', JSON.stringify(topUsers, null, 2));
    console.log('=== END ANALYTICS ===');
    
    return {
        messagesPerDay,
        activeUsers,
        inactiveUsers,
        topUsers
    };
};

// Delete user
exports.deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return { message: 'User deleted successfully' };
};

// Get user statistics
exports.getUserStats = async () => {
    const total = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const users = await User.countDocuments({ role: 'user' });
    
    // Calculate active users in last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const activeToday = await User.countDocuments({
        lastActive: { $gte: last24Hours }
    });
    
    // Recent users (last 5) with online status
    const recent = await User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email createdAt role');
    
    const recentWithStatus = recent.map(user => {
        const userObj = user.toObject();
        userObj.isOnline = onlineUsersMap.has(user._id.toString());
        return userObj;
    });
    
    return {
        total,
        admins,
        users,
        activeToday,
        recent: recentWithStatus
    };
};

// Get user conversation stats (for user table)
exports.getUserConversationStats = async () => {
    const users = await User.find().select('-password');
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
        // Count distinct conversations this user participated in
        const conversations = await Message.distinct('conversation', { sender: user._id });
        const conversationCount = conversations.length;
        
        // Get last message from this user
        const lastMessage = await Message.findOne({ sender: user._id })
            .sort({ createdAt: -1 });
        
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isOnline: onlineUsersMap.has(user._id.toString()),
            conversationCount,
            lastActive: lastMessage?.createdAt || user.createdAt,
        };
    }));
    
    // Sort by conversation count (most active first)
    usersWithStats.sort((a, b) => b.conversationCount - a.conversationCount);
    
    return usersWithStats;
};

// ========== CONVERSATION MANAGEMENT ==========

// Get all conversations with pagination
exports.getAllConversations = async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    
    const conversations = await Conversation.find()
        .populate('participants', 'name email')
        .populate('lastMessage')
        .sort('-updatedAt')
        .skip(skip)
        .limit(limit);
    
    // Get message count for each conversation
    const conversationsWithCount = await Promise.all(conversations.map(async (conv) => {
        const messageCount = await Message.countDocuments({ conversation: conv._id });
        return {
            ...conv.toObject(),
            messageCount,
        };
    }));
    
    const total = await Conversation.countDocuments();
    
    return {
        conversations: conversationsWithCount,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

// Get single conversation by ID with all messages
exports.getConversationById = async (conversationId) => {
    const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'name email');
    
    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }
    
    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'name email')
        .sort('createdAt');
    
    return {
        conversation,
        messages,
    };
};

// Delete conversation and all its messages
exports.deleteConversation = async (conversationId) => {
    const conversation = await Conversation.findByIdAndDelete(conversationId);
    
    if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
    }
    
    // Delete all messages in this conversation
    await Message.deleteMany({ conversation: conversationId });
    
    return { message: 'Conversation and all messages deleted successfully' };
};

// ========== MESSAGE MANAGEMENT ==========

// Get all messages with pagination and filters
exports.getAllMessages = async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (queryParams.userId) filter.sender = queryParams.userId;
    if (queryParams.search) {
        filter.content = { $regex: queryParams.search, $options: 'i' };
    }
    
    const messages = await Message.find(filter)
        .populate('sender', 'name email')
        .populate('conversation')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);
    
    const total = await Message.countDocuments(filter);
    
    return {
        messages,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

// Get message by ID
exports.getMessageById = async (messageId) => {
    const message = await Message.findById(messageId)
        .populate('sender', 'name email')
        .populate('conversation');
    
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }
    
    return message;
};

// Delete message (admin)
exports.deleteMessage = async (messageId) => {
    const message = await Message.findByIdAndDelete(messageId);
    
    if (!message) {
        throw new ApiError(404, 'Message not found');
    }
    
    return { message: 'Message deleted successfully' };
};

// Get message statistics
exports.getMessageStats = async () => {
    const total = await Message.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Message.countDocuments({
        createdAt: { $gte: today }
    });
    
    // Get users with most messages
    const topUsers = await Message.aggregate([
        { $group: { _id: '$sender', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { name: '$user.name', email: '$user.email', messageCount: '$count' } }
    ]);
    
    return {
        total,
        todayCount,
        topUsers,
    };
};
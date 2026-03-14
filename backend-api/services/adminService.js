const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

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
    
    const total = await User.countDocuments(filter);    
    return {
        users,
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
    return user;
};

// Update user (admin)
exports.updateUser = async (userId, data) => {
    const allowedFields = ['name', 'email', 'role'];
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
    return user;
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
    
    // Recent users (last 5)
    const recent = await User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email createdAt role');
    
    return {
        total,
        admins,
        users,
        recent
    };
};
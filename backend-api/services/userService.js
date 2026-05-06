const User = require('../models/userModel');
const ApiError = require('../utils/apiError');

exports.getMyProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

// Update logged in user's profile
exports.updateMyProfile = async (userId, data) => {
    const allowedFields = ['name', 'email', 'phone', 'address', 'bio'];
    
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    
    Object.keys(data).forEach(field => {
        if (allowedFields.includes(field) && data[field] !== undefined) {
            user[field] = data[field];
        }
    });
    
    await user.save();
    user.password = undefined;
    return user;
};

// Get all users except current user - MAKE SURE THIS IS EXACTLY THIS
exports.getAllUsers = async (currentUserId) => {
    console.log('getAllUsers service called with userId:', currentUserId); // Debug
    
    const users = await User.find({ 
        _id: { $ne: currentUserId }
    }).select('-password');
    
    console.log('Found users count:', users.length); // Debug
    return users;
};
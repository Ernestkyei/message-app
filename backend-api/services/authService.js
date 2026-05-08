// services/authService.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const ApiError = require('../utils/apiError');
const sendPasswordResetEmail = require('./emailService');

const signToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

const registerUser = async (name, email, password) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
        lastActive: new Date(),
        isOnline: true
    });

    const token = signToken(user._id, user.role);

    return {
        user,
        token
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }
    const isPasswordValid = await user.comparePassword(password);    
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }
    
    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();
    
    const token = signToken(user._id, user.role);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return {
        user: userResponse,
        token
    };
};

const logoutUser = async (userId) => {
    if (userId) {
        await User.findByIdAndUpdate(userId, {
            isOnline: false
        });
    }
    
    return {
        success: true,
        message: 'Logged out successfully'
    };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });    
    if (!user) {
        throw new ApiError(404, 'No user found with that email');
    }
    
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    await sendPasswordResetEmail(email, resetToken, user.name);
    
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    return {
        message: 'Password reset link sent to your email',
        resetURL,
        resetToken
    };
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
        throw new ApiError(400, 'Token is invalid or has expired');
    }
    
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.lastActive = new Date();
    await user.save();
    
    const loginToken = signToken(user._id, user.role);
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return {
        message: 'Password reset successful',
        token: loginToken,
        user: userResponse
    };
};

const updateLastActive = async (userId) => {
    if (userId) {
        await User.findByIdAndUpdate(userId, {
            lastActive: new Date(),
            isOnline: true
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    updateLastActive
};
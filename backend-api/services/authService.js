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
        password
    });

    const token = signToken(user._id, user.role);

    return {
        user,
        token
    };
};


// Login user
const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }
    const isPasswordValid = await user.comparePassword(password);    
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }
    const token = signToken(user._id, user.role);
    return {
        user,
        token
    };
};


// LOGOUT FUNCTION
const logoutUser = async () => {
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
    
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // SEND EMAIL TO USER (ADDED THIS LINE)
    await sendPasswordResetEmail(email, resetToken);
    
    // Create reset URL for frontend
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    return {
        message: 'Password reset link sent to your email',
        resetURL,
        resetToken
    };
};


// RESET PASSWORD FUNCTION
const resetPassword = async (token, newPassword) => {
    // Hash the token from the URL
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    // Find user with valid token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
        throw new ApiError(400, 'Token is invalid or has expired');
    }
    
    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
    
    // Generate new login token
    const loginToken = signToken(user._id, user.role);
    
    // Remove password from output
    user.password = undefined;
    
    return {
        message: 'Password reset successful',
        token: loginToken,
        user
    };
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,   
    resetPassword,    
};
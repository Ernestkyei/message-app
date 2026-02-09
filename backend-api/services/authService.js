const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');


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





module.exports = {
    registerUser,
    loginUser,
};

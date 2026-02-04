const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

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

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        user,
        token
    };
};

module.exports = {
    registerUser
};

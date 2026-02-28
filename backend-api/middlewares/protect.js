const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../utils/apiError');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        
        if (!token) {
            return next(new ApiError(401, 'You are not logged in. Please log in to access this resource.'));
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
        }


        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(401, 'Invalid token. Please log in again.'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Your token has expired. Please log in again.'));
        }
        next(error);
    }
};




module.exports = protect;
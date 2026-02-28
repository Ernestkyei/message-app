const ApiError = require('../utils/apiError');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'You are not logged in.'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'You do not have permission to perform this action.'));
        }

        next();
    };
};

module.exports = restrictTo;
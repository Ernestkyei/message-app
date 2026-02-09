const User = require('../models/userModel');
const ApiError = require('../utils/apiError');



exports.getMyProfile = async (userId) =>{
    const user = await User.findById(userId).select('-password');

    if(!user){
        throw new ApiError(404, 'User not found');
    }

  return user;
}




//update login user's profile
exports.updateMyProfile = async(userId, data) =>{
    const allowedFields = ['name', 'email', 'password'];
    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, 'User not found');
    }
    allowedFields.forEach(field =>{
        if(data[field]){
            user[field] = data[field];
        }
    });
    await user.save();
    user.password = undefined;
    return user;
}






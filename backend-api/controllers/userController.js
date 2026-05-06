const userService = require('../services/userService');

exports.getMyProfile = async(req, res, next) =>{
    try{
        const user = await userService.getMyProfile(req.user.id);
        res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        next(error);
    }
}

exports.updateMyProfile = async(req, res, next) =>{
    try{
        const updateUser = await userService.updateMyProfile(
            req.user.id,
            req.body
        );
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updateUser
        })
    }catch(err){
        next(err)
    }
}

// Get all users except current user
exports.getAllUsers = async(req, res, next) =>{
    try{
        const users = await userService.getAllUsers(req.user.id);
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })
    }catch(error){
        next(error);
    }
}
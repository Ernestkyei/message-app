const {getMyProfile, updateMyProfile} = require('../services/userService');


exports.getMyProfile = async(req, res, next) =>{
    try{
        const user = await getMyProfile(req.user.id);
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
        const updateUser = await updateMyProfile(
            req.user.id,
            req.body
        );
        res.status(200).json({
            success: true,
            user:updateUser
        })
    }catch(err){
        next(err)
    }
};

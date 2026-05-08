const authService = require('../services/authService');

exports.register = async(req, res, next) =>{
    try{
        const {name, email, password} = req.body;
        const result = await authService.registerUser(name, email, password);
        //success message
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: result.user,
            token: result.token
        });
    }catch(error){
        next(error);
    }
}

exports.login = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        const result = await authService.loginUser(email, password);      

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            user: result.user,
            token: result.token
        });

    }catch(error){
        next(error);
    }
}

exports.logout = async(req, res, next) => {
    try{
        const userId = req.user?._id;
        const result = await authService.logoutUser(userId);
        res.status(200).json({
            success: true,        
            message: result.message
        });
    }catch(error){
        next(error);
    }       
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        
        res.status(200).json({
            success: true,
            message: result.message,
            resetURL: result.resetURL,
            resetToken: result.resetToken
        });
    } catch (error) {
        next(error);
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const result = await authService.resetPassword(token, password);
        
        res.status(200).json({
            success: true,
            message: result.message,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};
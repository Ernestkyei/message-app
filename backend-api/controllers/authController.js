const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword} = require('../services/authService');




exports.register = async(req, res, next) =>{
    try{
        const {name, email, password} = req.body;
        const result = await registerUser(name, email, password);
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
        const result = await loginUser(email, password);      

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            user: result.user,
            token:result.token
        });

    }catch(error){
        next(error);
    }


}


exports.logout = async(req, res, next) => {
    try{
        const result = await logoutUser();
        res.status(200).json({
            success:true,        
            message: result.message
    });
    }catch(error){
        next(error);
    }       
}

// ADD FORGOT PASSWORD CONTROLLER
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await forgotPassword(email);
        
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

// ADD RESET PASSWORD CONTROLLER
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const result = await resetPassword(token, password);
        
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
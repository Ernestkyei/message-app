const {registerUser, loginUser} = require('../services/authService');




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
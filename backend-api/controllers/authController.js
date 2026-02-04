const {registerUser} = require('../services/authService');


exports.register = async(req, res, next) =>{
    console.log(req.body);
    try{
        const {name, email, password} = req.body;
        const result = await registerUser(name, email, password);

        //success message
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user: result.user,
            token: result.token
        });

    }catch(error){
        next(error);
    }
}
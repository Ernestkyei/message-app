const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');




const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: {
            success: false,
            message:"Too many attempt, please try again  after"
        }


})






router.post('/register',authLimiter, authController.register);
router.post('/login', authLimiter,authController.login);
router.get('/logout',protect, authController.logout);




module.exports = router;



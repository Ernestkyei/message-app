const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');




const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // increased for development
    message: {
        success: false,
        message: "Too many attempts, please try again after 15 minutes"
    }
});






router.post('/register',authLimiter, authController.register);
router.post('/login', authLimiter,authController.login);
router.post('/forgot-password', authController.forgotPassword);  
router.post('/reset-password/:token', authController.resetPassword);
router.get('/logout',protect, authController.logout);




module.exports = router;



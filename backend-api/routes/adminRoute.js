const express = require('express');
const router = express.Router();
const adminController  = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictTo');







//all Admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));




//user management route
router.get('/users', adminController.getAllUsers);
router.get('/user/stats', adminController.getUserStats);
router.get('/user/:id', adminController.getUserById);
router.patch('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);


module.exports = router;
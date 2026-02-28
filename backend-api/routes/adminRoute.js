const express = require('express');
const router = express.Router();
const adminController  = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictTo');







//ll Admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));




//user management route
router.get('/users', adminController.getAllUsers);
router.post('/users/stats', adminController.getUserStats);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);


module.exports = router;
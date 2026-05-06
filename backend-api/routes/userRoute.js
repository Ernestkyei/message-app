const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');




router.use(protect);

router.get('/me', userController.getMyProfile);
router.patch('/me', userController.updateMyProfile);
router.get('/all', userController.getAllUsers);





module.exports = router
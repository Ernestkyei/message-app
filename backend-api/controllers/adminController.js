const adminService = require('../services/adminService');


exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await adminService.getAllUsers(req.query);
        res.status(200).json({
            success: true,
            count: result.users.length,
            pagination: result.pagination,
            data: result.users
        });
    } catch (error) {
        next(error);
    }
};


exports.getUserById = async (req, res, next) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        const user = await adminService.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'user updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};


exports.deleteUser = async (req, res, next) => {
    try {
        const user = await adminService.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: 'user deleted successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};


exports.getUserStats = async (req, res, next) => {
    try {
        const stats = await adminService.getUserStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
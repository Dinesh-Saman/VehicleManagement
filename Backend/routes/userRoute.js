const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// Get current user route (protected)
router.get('/me', authMiddleware.protect, userController.getCurrentUser);

module.exports = router;
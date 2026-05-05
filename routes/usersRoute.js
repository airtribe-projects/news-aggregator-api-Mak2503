const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');
const { validate } = require('../middleware/validator');

/**
 * USER ROUTES
 * All endpoints for user management
 * 
 * Public Routes (no authentication required):
 *   - POST /api/v1/users/register - Create new user
 *   - POST /api/v1/users/login - User login
 */

// --- PUBLIC ROUTES (no authentication required) ---

/**
 * Register new user
 * POST /api/v1/users/register
 * Body: { name, email, password }
 */
router.post('/register', validate('userRegistration'), UserController.register);

/**
 * Login user
 * POST /api/v1/users/login
 * Body: { email, password }
 */
router.post('/login', validate('userLogin'), UserController.login);

module.exports = router;
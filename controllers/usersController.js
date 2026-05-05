const UserService = require('../services/usersService');
const { AppError } = require('../middleware/errorHandler');

/**
 * USER CONTROLLER
 * Handles HTTP requests and responses for user endpoints
 * Delegates business logic to UserService
 */

class UserController {
  /**
   * POST /api/v1/users/register
   * Register a new user account
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const user = await UserService.createUser({
        name,
        email,
        password
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users/login
   * Authenticate user and return JWT token
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { user, token } = await UserService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
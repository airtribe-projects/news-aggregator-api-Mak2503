const UserPreferencesService = require('../services/userPreferencesService');
const { AppError } = require('../middleware/errorHandler');

/**
 * PREFERENCES CONTROLLER
 * Handles HTTP requests and responses for preferences endpoints
 * Delegates business logic to UserPreferencesService
 */

class UserPreferencesController {
  /**
   * PUT /api/v1/preferences
   * Update user preferences
   */
  static async updatePreferences(req, res, next) {
    try {
      const userId = req.user.id; // Assuming user ID is available in req.user after authentication
      const { categories, sources } = req.body;

      const preferences = await UserPreferencesService.updateUserPreferences(userId, {
        categories,
        sources
      });

      res.status(201).json({
        success: true,
        message: 'User preferences updated successfully',
        data: { preferences }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/preferences
   * Get user preferences
   */
  static async getPreferences(req, res, next) {
    try {
      const userId = req.user.id; // Assuming user ID is available in req.user after authentication

      const preferences = await UserPreferencesService.getUserPreferences(userId);

      res.status(200).json({
        success: true,
        message: 'User preferences retrieved successfully',
        data: { preferences }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserPreferencesController;
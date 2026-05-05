const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userPreferencesModel  = require('../models/userPreferencesModel');
const { AppError } = require('../middleware/errorHandler');

/**
 * USER PREFERENCES SERVICE
 * Contains all business logic for user preferences operations
 * Handles: updating and retrieving user preferences
 */

class UserPreferencesService {
  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferencesData - { categories, sources }
   * @returns {Object} - Updated preferences object
   */
  static async updateUserPreferences(userId, preferencesData) {
    const { categories, sources } = preferencesData;

    // Find existing user preferences
    let userPreferences = await userPreferencesModel.findOne({ user_id: userId });

    if (!userPreferences) {
      // Create new user preferences
      userPreferences = await userPreferencesModel.create({
        user_id: userId,
        categories,
        sources
      });
    } else {
      // Update existing user preferences
      userPreferences.categories = categories;
      userPreferences.sources = sources;
      await userPreferences.save();
    }

    return userPreferences;
  }

  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Object} - User preferences object
   */
  static async getUserPreferences(userId) {
    const userPreferences = await userPreferencesModel.findOne({ user_id: userId });

    if (!userPreferences) {
      throw new AppError('User preferences not found', 404);
    }

    return userPreferences;
  }
}

module.exports = UserPreferencesService;
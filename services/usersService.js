const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersModel  = require('../models/usersModel');
const { AppError } = require('../middleware/errorHandler');

/**
 * USER SERVICE
 * Contains all business logic for user operations
 * Handles: password hashing, JWT creation, user CRUD operations
 */

class UserService {
  /**
   * Create a new user account
   * @param {Object} userData - { name, email, password }
   * @returns {Object} - Created user object (without password)
   */
  static async createUser(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await usersModel.create({
      name,
      email,
      password: hashedPassword
    });

    return this.formatUserResponse(user);
  }

  /**
   * Authenticate user and generate JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} - { user, token }
   */
  static async loginUser(email, password) {
    // Find user (include password for comparison)
    const user = await usersModel.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token
    };
  }

  /**
   * Generate JWT token
   * @param {string} userId - User ID
   * @returns {string} - JWT token
   */
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );
  }

  /**
   * Format user response (remove sensitive data)
   * @param {Object} user - Mongoose user document
   * @returns {Object} - Formatted user object
   */
  static formatUserResponse(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

module.exports = UserService;
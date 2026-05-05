const express = require("express");
const router = express.Router();
const UserController = require("../controllers/usersController");
const UserPreferencesController = require("../controllers/userPreferencesController");
const { validate } = require("../middleware/validator");
const { protect } = require("../middleware/auth");

/**
 * USER ROUTES
 * All endpoints for user management
 *
 * Public Routes (no authentication required):
 *   - POST /api/v1/users/register - Create new user
 *   - POST /api/v1/users/login - User login
 * Private Routes (authentication required):
 *   - PUT /api/v1/users/preferences - Update user preferences
 *   - GET /api/v1/users/preferences - Get user preferences
 */

// --- PUBLIC ROUTES (no authentication required) ---

/**
 * Register new user
 * POST /api/v1/users/register
 * Body: { name, email, password }
 */
router.post("/register", validate("userRegistration"), UserController.register);

/**
 * Login user
 * POST /api/v1/users/login
 * Body: { email, password }
 */
router.post("/login", validate("userLogin"), UserController.login);


// Apply authentication middleware to all routes below
router.use(protect);

// --- PRIVATE ROUTES (authentication required) ---

/**
 * Update user preferences
 * PUT /api/v1/users/preferences
 * Body: { categories, sources }
 */
router.put(
  "/preferences",
  validate("userPreferences"),
  UserPreferencesController.updatePreferences,
);

/**
 * Get user preferences
 * GET /api/v1/users/preferences
 */
router.get(
  "/preferences",
  UserPreferencesController.getPreferences,
);

module.exports = router;

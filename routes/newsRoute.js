const express = require('express');

/**
 * NEWS ROUTES
 *
 * Routes to retrieve news articles from an external provider (NewsAPI).
 * Endpoints are protected and require a valid JWT via the `protect` middleware.
 * The routes accept optional query parameters to refine results:
 *   - `q` (string): search query override for user preferences
 *   - `page` (integer): pagination page, default 1
 *   - `pageSize` (integer): number of articles per page, default 20
 *
 * Mounted paths in the application:
 *   - GET /api/v1/news
 */

const NewsController = require('../controllers/newsController');
const { protect } = require('../middleware/auth');
const { validateQuery } = require('../middleware/validator');

const router = express.Router();

/**
 * GET /api/v1/news
 *
 * Fetch personalized news for the authenticated user.
 * Query: `q`, `page`, `pageSize` (validated by `validateQuery('newsQuery')`).
 * Protected: yes (`protect` middleware).
 */
router.get('/', protect, validateQuery('newsQuery'), NewsController.getNews);

module.exports = router;
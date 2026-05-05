const NewsService = require('../services/newsService');

/**
 * NEWS CONTROLLER
 * Handles HTTP requests and responses for news endpoints
 * Delegates business logic to NewsService
 */

class NewsController {
  /**
   * GET /api/v1/news
   * Fetch personalized news for the authenticated user
   */
  static async getNews(req, res, next) {
    try {
      const userId = req.user.id;
      const news = await NewsService.getNewsForUser(userId, req.query);

      res.status(200).json({
        success: true,
        message: 'News articles retrieved successfully',
        data: news,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NewsController;
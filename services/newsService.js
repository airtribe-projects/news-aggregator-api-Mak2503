const axios = require('axios');
const UserPreferencesService = require('./userPreferencesService');
const { AppError } = require('../middleware/errorHandler');

/**
 * NEWS SERVICE
 * Contains all business logic for news operations
 * Handles: fetching news articles from external NewsAPI provider based on user preferences
 */

class NewsService {
  /**
   * Build news search query from user preferences and optional override
   * @param {Object} preferences - User preferences object with categories and sources
   * @param {string} customQuery - Optional custom search query override
   * @returns {string} - Constructed search query string
   */
  static buildNewsQuery(preferences, customQuery) {
    if (customQuery && customQuery.trim()) {
      return customQuery.trim();
    }

    const categories = Array.isArray(preferences.categories)
      ? preferences.categories.filter(Boolean)
      : [];

    if (categories.length > 0) {
      return categories.join(' OR ');
    }

    return 'news';
  }

  /**
   * Fetch news articles for a user based on their preferences
   * @param {string} userId - User ID to fetch preferences for
   * @param {Object} queryOptions - Optional query options { q, page, pageSize }
   * @returns {Object} - News response with articles and pagination info
   * @throws {AppError} - On configuration errors, API failures, or network issues
   */
  static async getNewsForUser(userId, queryOptions = {}) {
    const newsApiUrl = process.env.NEWS_API_URL;
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiUrl || !newsApiKey) {
      throw new AppError('News API is not configured properly', 500);
    }

    const preferences = await UserPreferencesService.getUserPreferences(userId);
    const page = Number(queryOptions.page || 1);
    const pageSize = Number(queryOptions.pageSize || 20);

    const params = {
      q: this.buildNewsQuery(preferences, queryOptions.q),
      page,
      pageSize,
      apiKey: newsApiKey,
    };

    if (Array.isArray(preferences.sources) && preferences.sources.length > 0) {
      params.sources = preferences.sources.join(',');
    }

    try {
      const response = await axios.get(newsApiUrl, {
        params,
        timeout: 10000,
      });

      if (response.data?.status !== 'ok') {
        throw new AppError('Unexpected response from news provider', 502);
      }

      return {
        totalResults: response.data.totalResults || 0,
        page,
        pageSize,
        articles: response.data.articles || [],
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status } = error.response;

          if (status === 400) {
            throw new AppError('Invalid request sent to news provider', 400);
          }

          if (status === 401 || status === 403) {
            throw new AppError('News API authentication failed', 502);
          }

          if (status === 429) {
            throw new AppError('News API rate limit exceeded', 429);
          }

          throw new AppError('News provider request failed', 502);
        }

        if (error.request) {
          throw new AppError('News provider is unavailable', 503);
        }
      }

      throw new AppError('Failed to fetch news articles', 500);
    }
  }
}

module.exports = NewsService;
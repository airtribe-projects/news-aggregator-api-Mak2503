# News Aggregator API

A robust REST API for aggregating personalized news articles based on user preferences. Built with Express.js and MongoDB, this API provides user authentication, preference management, and intelligent news fetching from external providers.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)

## Project Overview

The News Aggregator API is a backend service designed to deliver personalized news content to users. It allows users to:

- Create accounts and manage authentication securely
- Set preferences for news categories and sources
- Retrieve news articles tailored to their interests
- Manage their profile and preferences through a RESTful API

The API integrates with external news providers (NewsAPI) to fetch real-time news articles and presents them with pagination support.

## Features

✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing  
✅ **User Preferences** - Save and manage news categories and sources  
✅ **Personalized News** - Fetch news based on user preferences with pagination  
✅ **Input Validation** - Comprehensive request validation using Joi  
✅ **Security** - Helmet for HTTP headers, CORS support, input sanitization  
✅ **Error Handling** - Centralized error handling with meaningful error messages  
✅ **Logging** - Request logging for monitoring and debugging  
✅ **Performance** - Response compression and rate limiting considerations  
✅ **Testing** - Unit and integration tests with Tap

## Tech Stack

- **Runtime**: Node.js 18.0.0 or higher
- **Framework**: Express.js 4.22.1
- **Database**: MongoDB with Mongoose 9.6.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Security**: Helmet 8.1.0, bcryptjs 3.0.3
- **Validation**: Joi 18.2.1
- **HTTP Client**: Axios 1.16.0
- **Testing**: Tap 18.6.1, Supertest 6.3.4
- **Utilities**: CORS, Compression, dotenv

## Installation

### Prerequisites

- Node.js version 18.0.0 or higher
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-aggregator-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/news-aggregator
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE=7d
   NEWS_API_KEY=your-newsapi-key
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/news-aggregator |
| `JWT_SECRET` | Secret key for signing JWT tokens | (required) |
| `NEWS_API_KEY` | API key for external news provider | (required) |

### Database Setup

Ensure MongoDB is running and accessible at your `MONGODB_URI`. The application will automatically create required collections and indexes on first run.

## Running the Application

### Development Mode

Start the server with auto-reload on file changes:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Production Mode

```bash
NODE_ENV=production npm start
```

### Health Check

Test if the API is running:
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "success": true,
  "message": "News Aggregator is Live"
}
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### User Management

#### Register a New User

```
POST /users/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error"
}
```

---

#### Login User

```
POST /users/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### User Preferences

#### Get User Preferences

```
GET /users/preferences
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User preferences retrieved successfully",
  "data": {
    "preferences": {
      "id": "pref_id",
      "userId": "user_id",
      "categories": ["technology", "business"],
      "sources": ["bbc-news", "cnn"]
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

#### Update User Preferences

```
PUT /users/preferences
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "categories": ["technology", "science", "health"],
  "sources": ["bbc-news", "the-verge", "techcrunch"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User preferences updated successfully",
  "data": {
    "preferences": {
      "id": "pref_id",
      "userId": "user_id",
      "categories": ["technology", "science", "health"],
      "sources": ["bbc-news", "the-verge", "techcrunch"]
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error"
}
```

---

### News

#### Get Personalized News

```
GET /news
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | (from preferences) | Search query to override user preferences |
| `page` | integer | 1 | Pagination page number |
| `pageSize` | integer | 20 | Number of articles per page |

**Example Requests:**

```bash
# Get news based on user preferences
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/api/v1/news

# Get news for a specific query
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/v1/news?q=artificial%20intelligence"

# Get news with pagination
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/v1/news?page=2&pageSize=10"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News articles retrieved successfully",
  "data": [
    {
      "source": {
        "id": "bbc-news",
        "name": "BBC News"
      },
      "author": "John Smith",
      "title": "Latest Technology Breakthrough",
      "description": "Scientists announce a major breakthrough...",
      "url": "https://example.com/article",
      "urlToImage": "https://example.com/image.jpg",
      "publishedAt": "2024-05-01T10:30:00Z",
      "content": "Full article content..."
    }
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

## Authentication

### JWT Authentication

The API uses JWT (JSON Web Tokens) for secure authentication. To access protected endpoints:

1. **Register** a new user or **login** with existing credentials
2. **Receive** a JWT token in the response
3. **Include** the token in the `Authorization` header for subsequent requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

### Token Structure

Tokens expire based on the `JWT_EXPIRE` environment variable (default: 7 days). After expiration, users must log in again.

### Security Best Practices

- Store tokens securely (e.g., httpOnly cookies)
- Never expose tokens in URLs or logs
- Use HTTPS in production
- Rotate JWT secrets periodically
- Implement token refresh mechanisms for long-lived sessions

---

## Testing

Run the test suite to validate the API:

```bash
npm test
```

Tests are located in the `test/` directory and cover:
- User registration and authentication
- Preference management
- News fetching
- Error handling
- Input validation

### Writing Tests

Use the existing test structure as a template. Tests use Supertest for HTTP assertions and Tap as the test runner.

---

## Project Structure

```
.
├── app.js                          # Express app configuration
├── server.js                       # Server entry point
├── package.json                    # Project dependencies
├── .env.example                    # Environment variables template
│
├── controllers/                    # Request handlers
│   ├── newsController.js
│   ├── usersController.js
│   └── userPreferencesController.js
│
├── services/                       # Business logic
│   ├── newsService.js
│   ├── usersService.js
│   └── userPreferencesService.js
│
├── models/                         # MongoDB schemas
│   ├── usersModel.js
│   └── userPreferencesModel.js
│
├── routes/                         # API route definitions
│   ├── usersRoute.js
│   └── newsRoute.js
│
├── middleware/                     # Express middleware
│   ├── auth.js                     # JWT authentication
│   ├── errorHandler.js             # Global error handling
│   ├── logger.js                   # Request logging
│   └── validator.js                # Input validation
│
└── test/                           # Test suites
    └── server.test.js
```

---

## Error Handling

The API implements centralized error handling with meaningful error messages. All errors follow a consistent JSON format:

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Invalid input or validation error |
| `401` | Unauthorized - Missing or invalid authentication |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |

### Input Validation

All request inputs are validated using Joi schemas. Validation errors provide detailed feedback about which fields are invalid and why.

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass (`npm test`)
5. Submit a pull request

## License

ISC - See package.json for details

## Support

For issues or questions, please open an issue on the repository or contact the development team.

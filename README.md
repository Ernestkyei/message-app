# Message App Backend API

## Overview
This is the backend API for the Message App, built using Node.js, Express, and MongoDB. It provides authentication, user management, and administrative features with role-based access control.

## Features
- **Authentication**: JWT-based registration, login, and logout.
- **Security**: 
  - Rate limiting on authentication endpoints.
  - Protected routes using JWT verification.
  - Role-based access control (Admin/User).
- **User Management**: View and update user profiles.
- **Admin Controls**: Manage users, view statistics, and perform CRUD operations on user data.

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** (JSON Web Tokens)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   ```

2. **Install dependencies**
   Navigate to the `backend-api` folder and run:
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root of `backend-api` and configure the following:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRE=30d
   ```

4. **Run the server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login and receive a token |
| GET    | `/api/auth/logout`   | Logout the current user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users/me` | Get current user's profile |
| PATCH  | `/api/users/me` | Update current user's profile |

### Admin (Restricted)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/users` | Get all users (supports pagination) |
| GET    | `/api/admin/user/stats` | Get user statistics |
| GET    | `/api/admin/user/:id` | Get a specific user by ID |
| PATCH  | `/api/admin/user/:id` | Update a specific user |
| DELETE | `/api/admin/user/:id` | Delete a specific user |

## Error Handling
The API uses a centralized error handling middleware to return consistent JSON error responses.

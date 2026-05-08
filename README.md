# Message App - Admin Portal

A modern, secure messaging platform with an admin dashboard for user management, message monitoring, and system notifications.

## Tech Stack

### Frontend (Admin Portal)
- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Recharts** - Analytics charts

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Nodemailer** - Email (Mailtrap)
- **Bcrypt** - Password hashing

## Features

### Authentication
- Admin login with JWT authentication
- Password reset with email verification
- Protected routes and role-based access
- Secure logout functionality

### Admin Dashboard
- Real-time analytics and statistics
- User management (CRUD operations)
- Message logs and conversation history
- Push notifications system
- System settings configuration

### Security Features
- JWT token-based authentication
- Protected admin routes
- Email verification for password reset
- Rate limiting on auth endpoints
- Password hashing with bcrypt

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/yourusername/message-app.git
cd message-app

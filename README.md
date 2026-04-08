# MERN Authentication (Password-Only Login, Session Refresh)

A production-ready authentication system built with the MERN stack (MongoDB, Express, React, Node.js). This project implements secure JWT authentication with refresh token rotation, Redis-based caching, and a simplified password-only login flow.

## 🚀 Key Features

### 🔐 Authentication

- **Dual Token Architecture**: Uses short-lived **Access Tokens** (1 min) for security and long-lived **Refresh Tokens** (7 days) for user convenience.
- **Secure Storage**: Tokens are stored in **HttpOnly, Secure Cookies** to prevent XSS attacks.
- **Auto-Refresh**: Frontend Axios interceptors automatically refresh expired access tokens without user intervention.
- **Email Verification**: Account creation uses email link verification. OTP-based login has been removed.

### 🛡️ Access Control

- Role-based access control has been removed. Routes are protected via authentication only (JWT).

### ⚡ Performance & Security

- **Redis Caching**: Caches user sessions, permissions, and refresh tokens.
- **Rate Limiting**: Redis-based rate limiting on sensitive endpoints (Registration, Email sending).
- **Input Validation**: Strict schema validation using **Zod**.
- **Sanitization**: Protection against NoSQL injection using `mongo-sanitize`.

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Caching**: Redis (Upstash/Local)
- **Auth**: JWT, Bcrypt, Cookie-Parser
- **Validation**: Zod
- **Email**: Nodemailer

### Frontend

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Networking**: Axios (with Interceptors)
- **Routing**: React Router DOM

## 📂 Project Structure

```
├── backend/
│   ├── config/         # DB, Redis, Email, & Permission configs
│   ├── controller/     # Auth & User logic
│   ├── middleware/     # Auth, RBAC, & Error handling
│   ├── models/         # User & Role schemas
│   ├── routes/         # API routes
│   └── scripts/        # Seeding & Debugging scripts
└── frontend/
    ├── src/
    │   ├── context/    # Auth Context
    │   ├── pages/      # Login, Dashboard, Home
    │   └── apiInterceptor.js # Auto-token refresh logic
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Redis (Local or Cloud)

### 1. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=your_mongo_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_super_secret
REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://import.meta.env.VITE_SERVER_URL
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

**Note:** RBAC seeding scripts have been deprecated.

**Run Server:**

```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Workflow

1. **Login**: Client sends email and password. Server validates credentials, issues `accessToken` and `refreshToken` cookies.
2. **Access Protected Route**: Middleware `isAuth` verifies `accessToken` from cookies.
3. **Token Expiry**: Backend returns `401 Unauthorized`. Frontend Interceptor catches error -> calls `/refresh` -> retries the original request.
4. **Redirection**: After successful login, frontend immediately refetches user and redirects to Home.

# 🔐 Full-Stack Login & Signup Application

A **portfolio-ready** full-stack authentication system built with industry-level architecture.

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, React Router v6   |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL                        |
| Auth       | JWT (jsonwebtoken), bcrypt        |
| HTTP       | Axios                             |
| Validation | express-validator (server-side)   |

---

## 📁 Project Structure

```
fullstack-auth-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # PostgreSQL pool
│   │   ├── controllers/           # Auth logic (signup, login, profile)
│   │   ├── middleware/            # JWT protect middleware
│   │   └── routes/authRoutes.js  # API routes
│   ├── schema.sql                 # DB schema to run once
│   ├── .env                       # ⚠️ Update with your credentials
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/auth.js            # Axios API client
    │   ├── context/AuthContext    # Global auth state
    │   ├── components/            # Navbar, ProtectedRoute, Toast
    │   └── pages/                 # Login, Signup, Dashboard
    └── package.json
```

---

## 🚀 Getting Started

### Step 1 — PostgreSQL Setup

1. Make sure PostgreSQL is installed and running.
2. Create the database and table:

```bash
psql -U postgres
CREATE DATABASE authdb;
\c authdb
```

Then run the SQL schema:

```bash
psql -U postgres -d authdb -f backend/schema.sql
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Edit **`.env`** with your credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=authdb
DB_USER=postgres
DB_PASSWORD=your_actual_password
JWT_SECRET=replace_with_random_secret_string
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
# Server runs at http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint            | Access    | Description             |
|--------|---------------------|-----------|-------------------------|
| POST   | `/api/auth/signup`  | Public    | Register a new user     |
| POST   | `/api/auth/login`   | Public    | Login & receive JWT     |
| GET    | `/api/auth/profile` | Protected | Get current user info   |
| GET    | `/api/health`       | Public    | Server health check     |

---

## ✨ Features

- ✅ Secure password hashing with **bcrypt** (12 salt rounds)
- ✅ Stateless authentication with **JWT** (7-day expiry)
- ✅ Server-side validation with **express-validator**
- ✅ Client-side form validation with live feedback
- ✅ **Password strength indicator** on signup
- ✅ Show/hide password toggle
- ✅ **Protected routes** (auto-redirect if not logged in)
- ✅ Session persistence via **localStorage**
- ✅ Animated **toast notifications**
- ✅ Premium **dark-mode glassmorphism** UI
- ✅ Fully **responsive** layout

---

## 🔒 Security Notes

- Passwords are **never stored in plain text**
- JWT secret should be a long random string in production
- Use **HTTPS** in production
- Consider adding rate limiting (e.g., `express-rate-limit`) for production

---

*Built as part of Full Stack Development Internship Training*

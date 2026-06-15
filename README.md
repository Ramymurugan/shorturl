# SmartLink — URL Shortener

A full-stack URL shortening application with analytics, QR code generation, admin dashboard, and user management.

---

## Video Demo

▶️ [Watch the Demo on YouTube](https://youtu.be/my00ZpdIWuI)

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Ramymurugan/Shorturl-with-Analytics.git
cd Shorturl
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/` with the following:

```env
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

MONGO_URI=mongodb://127.0.0.1:27017/smartlink

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM=noreply@smartlink.com
```

Start the backend:

```bash
npm run dev
```

Seed the default admin user:

```bash
node src/database/seedAdmin.js
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Assumptions Made

- MongoDB is running locally on the default port `27017`. MongoDB Atlas URI can be substituted in `.env`.
- A single admin account is seeded via `seedAdmin.js`. Additional admins must be created directly in the database.
- Short codes are unique 6-character nanoid strings; collision probability is negligible for typical usage.
- Email features (e.g., password reset) require valid SMTP credentials in `.env`; they are non-blocking if not configured.
- JWT tokens expire in 30 days by default; this can be adjusted via `JWT_EXPIRE` in `.env`.
- The frontend proxies API requests to `http://localhost:5000` during development.
- QR codes are generated server-side and returned as base64 PNG data URLs.
- Click analytics (IP, device, browser, referrer) are captured on every redirect without requiring user authentication.

---

## AI Planning Document

### Problem Statement

Build a production-ready URL shortener with user authentication, click analytics, QR code generation, and an admin control panel.

### AI-Assisted Planning Steps

1. **Feature scoping** — AI helped identify the core feature set: auth, URL CRUD, redirect, analytics capture, QR generation, and admin management.
2. **Architecture decision** — AI recommended a decoupled REST API (Express + MongoDB) and SPA frontend (React + Vite) for independent scalability.
3. **Data modeling** — AI proposed three Mongoose models: `User`, `Url`, and `Analytics`, with `Url` referencing `User` and `Analytics` referencing `Url`.
4. **Middleware design** — AI suggested layered middleware: `authMiddleware` (JWT verify), `adminMiddleware` (role check), `validateMiddleware` (input schema), and `errorMiddleware` (global handler).
5. **Analytics strategy** — AI recommended capturing analytics passively on redirect rather than via a separate client call, to ensure accuracy.
6. **Security hardening** — AI advised using `helmet`, `bcryptjs` for password hashing, and JWT-based stateless auth with role separation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                       │
│                  React + Vite (port 5173)                   │
│                                                             │
│  Pages: Login · Register · Dashboard · MyLinks · Analytics  │
│         QRCodes · Settings · Admin (Dashboard/Users/URLs)   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP / REST API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER (port 5000)                 │
│                                                             │
│  Routes:                                                    │
│  POST /api/auth/*        →  authController                  │
│  GET|POST /api/url/*     →  urlController                   │
│  GET /api/analytics/*    →  analyticsController             │
│  GET|POST /api/admin/*   →  adminController                 │
│  GET /:code              →  redirect + analytics capture    │
│                                                             │
│  Middleware: helmet · cors · morgan · auth · admin · error  │
│                                                             │
│  Services:                                                  │
│  shortCodeService · qrService · mailService · analytics     │
└───────────────────────┬─────────────────────────────────────┘
                        │ Mongoose ODM
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                        MONGODB                              │
│                                                             │
│  Collections:                                               │
│  users      — _id, name, email, passwordHash, role         │
│  urls        — _id, shortCode, originalUrl, userId, clicks  │
│  analytics   — _id, urlId, ip, device, browser, referrer   │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow — Short URL Redirect

```
User visits http://localhost:5000/abc123
        │
        ▼
Express GET /:code
        │
        ▼
urlController.redirectUrl()
   ├── Find Url doc by shortCode
   ├── Increment click count
   ├── Save Analytics doc (async, non-blocking)
   └── 302 Redirect → originalUrl
```

### Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite, React Router, Recharts, Lucide |
| Backend    | Node.js, Express 5, Mongoose      |
| Database   | MongoDB                           |
| Auth       | JWT (jsonwebtoken), bcryptjs      |
| QR Codes   | qrcode (server-side)              |
| Email      | Nodemailer                        |
| Security   | Helmet, CORS                      |

---

## Author

- **Ramymurugan** - *Initial commit & development*

---

This project is a part of a hackathon run by https://katomaran.com

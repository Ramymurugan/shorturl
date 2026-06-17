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


## output
Admin 
sigup page<img width="1913" height="896" alt="image" src="https://github.com/user-attachments/assets/bca2b80f-7d2f-4480-a55e-27893f266857" />
login page<img width="1913" height="896" alt="image" src="https://github.com/user-attachments/assets/00552479-66a8-4fff-9ed5-aecb3319eb40" />
Admin page <img width="1917" height="919" alt="image" src="https://github.com/user-attachments/assets/906ab6ee-3458-405c-b906-542d484642ef" />
dashboard <img width="1919" height="935" alt="image" src="https://github.com/user-attachments/assets/febebd22-2f38-4ee0-9e95-b0cafca57fbb" />
user's <img width="1915" height="910" alt="image" src="https://github.com/user-attachments/assets/5d841c05-4eae-41a9-8bfb-4a03e6034f01" />
Request <img width="1914" height="923" alt="image" src="https://github.com/user-attachments/assets/c24b81c0-8a3e-4f69-8fed-11775fe810f3" />
System url <img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/0fd383f7-0fe4-4bea-83c1-8ed1ea57242f" />
reports <img width="1914" height="915" alt="image" src="https://github.com/user-attachments/assets/2adc7e40-6ed8-4260-9ab1-c2c27e60e5f8" />

User
sigup page<img width="1908" height="897" alt="image" src="https://github.com/user-attachments/assets/e5fa1134-322b-40e8-8e81-cc95be69c37c" />
log in page <img width="1896" height="901" alt="image" src="https://github.com/user-attachments/assets/6bbc7197-c5ce-4b76-9b1d-ab93fe375074" />
dashboard <img width="1919" height="896" alt="image" src="https://github.com/user-attachments/assets/d8fdfa66-985e-495c-9620-c73d9ce9dd9d" />
My link <img width="1918" height="922" alt="image" src="https://github.com/user-attachments/assets/ba5d9e38-c3a8-483b-9ab3-48c3b7bf2464" />
Analytics <img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/3972ad46-07d0-422b-9d8a-7fb96c0313fa" />
QR page <img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/5919f534-6495-4e96-bb57-b107fd8f298e" />
settings page<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/2e67e4aa-ae92-45e7-b102-47295b64dd27" />















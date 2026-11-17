# AUTHENTIQ API — Login Validation REST API & Cybersecurity Portal

An educational Node.js and Express.js authentication validation service paired with a cybersecurity-inspired split-screen web interface. Built as **Week 4 Task 4** for the **Webora Tec** Web Development Internship.

---

## Overview

**AUTHENTIQ API** demonstrates how a backend REST endpoint (`POST /api/login`) receives JSON credentials, validates required fields, verifies them against environment-isolated server variables using `dotenv`, and enforces strict HTTP status codes (`200`, `400`, `401`) without ever logging or returning passwords.

> **Educational Disclaimer:** This project is an educational prototype designed to teach request validation, environment secret management, and HTTP authentication semantics. It is **not** intended for production deployment without cryptographic password hashing (`bcrypt`/`Argon2`), database storage, HTTPS/TLS, rate limiting, and signed session tokens (`JWT` or `HttpOnly` cookies).

---

## Features

- **RESTful Login Endpoint (`POST /api/login`):** Parses JSON request payloads via `express.json()` and validates credentials safely.
- **Strict HTTP Status Enforcement:** Returns `200 OK` on valid match, `400 Bad Request` on missing/empty fields, `401 Unauthorized` on invalid credentials, `404 Not Found` on unknown routes, and `500 Internal Server Error` if server environment variables are missing.
- **Zero Password Exposure:** Never logs submitted passwords to the server console and never echoes passwords in API responses or the frontend response viewer.
- **Environment Variable Isolation:** Uses `dotenv` to load local demo credentials from `.env` while keeping secrets excluded from Git via `.gitignore`.
- **Cybersecurity Split-Screen UI:** Features a 3D interactive holographic shield and padlock centerpiece, show/hide password toggle, loading states, status notifications, and a **Live API Response Viewer** with one-click JSON copy.

---

## Technologies Used

- **Backend:** Node.js, Express.js, dotenv
- **Frontend:** HTML5, CSS3 (Glassmorphism & 3D CSS Transforms), Vanilla JavaScript (`fetch` API)
- **Development & Testing:** npm, nodemon, Postman

---

## Project Folder Structure

```text
AUTHENTIQ-API/
├── public/                 # Static frontend served by Express
│   ├── index.html          # Split-screen cybersecurity portal & API documentation UI
│   ├── style.css           # Obsidian/navy theme, emerald/cyan accents, 3D shield animations
│   └── script.js           # Form handling, show/hide toggle, fetch() calls, live JSON viewer
├── .env                    # Private local environment variables (ignored by Git)
├── .env.example            # Public template showing required environment keys
├── .gitignore              # Excludes node_modules/ and .env from version control
├── package.json            # Project metadata, dependencies, and npm scripts
├── package-lock.json       # Locked dependency tree for reproducible installs
├── README.md               # Complete technical and security documentation
└── server.js               # Express server, middleware, POST /api/login & error handlers
```

---

## Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Intkhab1003/authentiq-api.git](https://github.com/Intkhab1003/authentiq-api.git)
   cd authentiq-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure local demo credentials:**
   Copy `.env.example` to a new file named `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your local demo values:
   ```env
   PORT=5000
   DEMO_USERNAME=your_demo_username_here
   DEMO_PASSWORD=your_demo_password_here
   ```

---

## Running the Application

- **Development Mode (with auto-restart via `nodemon`):**
  ```bash
  npm run dev
  ```
- **Standard Production Mode:**
  ```bash
  npm start
  ```

Once running, open **`http://localhost:5000`** in your browser.

---

## API Endpoint Documentation

### `POST /api/login`

Validates a user's submitted `username` and `password` against server-side environment variables.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body (Placeholder Example)
```json
{
  "username": "your_demo_username_here",
  "password": "your_demo_password_here"
}
```

#### HTTP Status Codes & Responses

| Status Code | Meaning | Trigger Condition | Sample JSON Response |
| :--- | :--- | :--- | :--- |
| **`200 OK`** | Authenticated | Both `username` and `password` match `.env` values | `{"success": true, "status": 200, "message": "Authentication successful. Access granted.", "data": {"username": "your_demo_username_here", "role": "Internship Demo User", "authenticatedAt": "2026-11-17T08:00:00.000Z", "mode": "Educational Demo (Non-Production)"}}` |
| **`400 Bad Request`** | Validation Error | `username` or `password` is missing, non-string, or blank | `{"success": false, "status": 400, "error": "Bad Request", "message": "Both username and password are required and cannot be empty."}` |
| **`401 Unauthorized`** | Invalid Credentials | Username, password, or both do not match | `{"success": false, "status": 401, "error": "Unauthorized", "message": "Invalid username or password."}` |
| **`404 Not Found`** | Unknown Route | Request sent to an undefined endpoint | `{"success": false, "status": 404, "error": "Not Found", "message": "Endpoint GET /api/unknown does not exist."}` |
| **`500 Internal Error`** | Server Misconfigured | Missing `DEMO_USERNAME` or `DEMO_PASSWORD` in server environment | `{"success": false, "status": 500, "error": "Server Configuration Error", "message": "Authentication service is not properly configured."}` |

---

## Postman Testing Checklist

Configure Postman with `POST http://localhost:5000/api/login`, header `Content-Type: application/json`, and **Body -> raw -> JSON**:

1. **Correct Credentials (`200 OK`):** Send valid placeholder credentials matching `.env`.
2. **Wrong Username (`401 Unauthorized`):** `{"username": "wrong_user", "password": "your_demo_password_here"}`
3. **Wrong Password (`401 Unauthorized`):** `{"username": "your_demo_username_here", "password": "wrong_password"}`
4. **Both Wrong (`401 Unauthorized`):** `{"username": "wrong_user", "password": "wrong_password"}`
5. **Missing Username (`400 Bad Request`):** `{"password": "sample_password"}`
6. **Missing Password (`400 Bad Request`):** `{"username": "your_demo_username_here"}`
7. **Both Fields Empty (`400 Bad Request`):** `{"username": "", "password": "   "}`
8. **Live Browser Portal Login (`200 OK`):** Submit valid credentials via `http://localhost:5000` and inspect the Live API Response Viewer.

---

## Security Limitations (Demo vs. Production)

| Security Layer | AUTHENTIQ Educational Demo | Production-Grade Authentication |
| :--- | :--- | :--- |
| **Credential Storage** | Single demo account in `.env` | Multi-user relational/NoSQL database |
| **Password Handling** | Plaintext equality comparison in memory | Salted one-way hashes (`Argon2id` or `bcrypt`) |
| **Session State** | Stateless JSON response | Signed `JWT` or encrypted `HttpOnly` cookies |
| **User Enumeration** | Generic `401` message prevents username guessing | Generic `401` + rate limiting & CAPTCHA/lockouts |
| **Transport Layer** | Local `HTTP` (`localhost`) | Enforced `HTTPS / TLS` encryption |
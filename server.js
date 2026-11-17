require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware to parse incoming JSON request bodies
app.use(express.json());

// 2. Middleware to serve static frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 3. POST /api/login - Login Validation Endpoint
app.post('/api/login', (req, res) => {
  // Verify that server environment variables are configured
  const demoUsername = process.env.DEMO_USERNAME;
  const demoPassword = process.env.DEMO_PASSWORD;

  if (!demoUsername || !demoPassword) {
    console.error('[SECURITY CONFIG ERROR] Missing demo credentials in environment variables.');
    return res.status(500).json({
      success: false,
      status: 500,
      error: 'Server Configuration Error',
      message: 'Authentication service is not properly configured.'
    });
  }

  // Extract username and password safely from req.body
  const { username, password } = req.body || {};

  // Validate that both fields exist, are strings, and are not empty
  const isUsernameInvalid = typeof username !== 'string' || username.trim() === '';
  const isPasswordInvalid = typeof password !== 'string' || password.trim() === '';

  if (isUsernameInvalid || isPasswordInvalid) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Bad Request',
      message: 'Both username and password are required and cannot be empty.'
    });
  }

  const cleanUsername = username.trim();

  // Log the login attempt safely (NEVER log passwords!)
  console.log(`[AUTH] Login attempt for username: "${cleanUsername}" at ${new Date().toISOString()}`);

  // Compare submitted credentials against environment variables
  const isMatch = cleanUsername === demoUsername && password === demoPassword;

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      status: 401,
      error: 'Unauthorized',
      message: 'Invalid username or password.'
    });
  }

  // Return HTTP 200 OK without ever echoing back the password
  return res.status(200).json({
    success: true,
    status: 200,
    message: 'Authentication successful. Access granted.',
    data: {
      username: cleanUsername,
      role: 'Internship Demo User',
      authenticatedAt: new Date().toISOString(),
      mode: 'Educational Demo (Non-Production)'
    }
  });
});

// 4. 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// 5. Centralized Error Handling Middleware (e.g., malformed JSON syntax)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Invalid JSON',
      message: 'Request body contains malformed JSON syntax.'
    });
  }

  console.error('[SERVER ERROR]', err.message);
  return res.status(500).json({
    success: false,
    status: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server.'
  });
});

// 6. Start the Express server
app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`AUTHENTIQ API running on http://localhost:${PORT}`);
  console.log('Mode: Educational Login Validation Demo');
  console.log('==================================================');
});
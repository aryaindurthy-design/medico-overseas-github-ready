require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { db,saveCallback, getAllCallbacks, updateCallbackStatus } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,  // Allow all origins including file:// protocol
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'medico-overseas-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Handle preflight requests
app.options('*', cors());

// Routes
// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, username, password)
       VALUES (?, ?, ?, ?)`,
      [name, email, username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({
              success: false,
              message: 'Email or username already exists'
            });
          }

          console.error('Registration error:', err.message);

          return res.status(500).json({
            success: false,
            message: 'Unable to create account'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Account created successfully',
          id: this.lastID
        });
      }
    );

  } catch (error) {
    console.error('Registration error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});


// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        console.error('Login database error:', err.message);

        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      };

      res.json({
        success: true,
        message: 'Login successful',
        user: req.session.user
      });
    }
  );
});


// Check logged-in user
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Not logged in'
    });
  }

  res.json({
    success: true,
    user: req.session.user
  });
});


// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// POST callback request
app.post('/api/callback', async (req, res) => {
  try {
    const { fullName, phone, email, city, country, neetScore, message } = req.body;

    // Validation
    if (!fullName || !phone) {
      return res.status(400).json({ 
        message: 'Full name and phone are required' 
      });
    }

    // Save to database
    const result = await saveCallback({
      fullName,
      phone,
      email: email || null,
      city: city || null,
      country: country || 'Not selected',
      neetScore: neetScore || null,
      message: message || null
    });

    console.log('✓ New callback request saved:', result);

    res.status(201).json({ 
      success: true,
      message: 'Callback request received successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Error saving callback:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error saving callback request: ' + error.message 
    });
  }
});

// GET all callbacks (for admin/dashboard)
app.get('/api/callbacks', async (req, res) => {
  try {
    const callbacks = await getAllCallbacks();
    res.json({ 
      success: true,
      count: callbacks.length,
      callbacks: callbacks 
    });
  } catch (error) {
    console.error('Error fetching callbacks:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching callbacks: ' + error.message 
    });
  }
});

// PUT update callback status
app.put('/api/callbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        message: 'Status is required' 
      });
    }

    const result = await updateCallbackStatus(id, status);
    res.json({ 
      success: true,
      message: 'Callback status updated',
      result: result
    });

  } catch (error) {
    console.error('Error updating callback:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error updating callback: ' + error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    message: 'Server error: ' + err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🏥 MEDICO OVERSEAS BACKEND SERVER                       ║
║                                                            ║
║    Server running at: http://localhost:${PORT}             ║
║    API Endpoints:                                         ║
║    - POST   /api/callback          (Submit callback)      ║
║    - GET    /api/callbacks         (View all callbacks)   ║
║    - PUT    /api/callbacks/:id     (Update status)        ║
║    - GET    /api/health            (Health check)         ║
║                                                            ║
║    Database: SQLite (callbacks.db)                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

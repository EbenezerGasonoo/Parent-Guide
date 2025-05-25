console.log('Starting server with port 5001...');

const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // React app's address
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// --- Test Database Route ---
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admins');
    console.log('Database test query successful:', rows);
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('Database test query error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});
// --- End Test Database Route ---

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('Connected to MySQL database');

    // Initialize database (create tables and admin account)
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 
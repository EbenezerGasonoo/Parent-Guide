const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = 'your-secret-key-here';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified, user:', decoded);

    // Check both users and admins tables
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    const [admins] = await pool.query('SELECT * FROM admins WHERE id = ?', [decoded.userId]);

    if (users.length === 0 && admins.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin status...');
    console.log('User from request:', req.user);

    // Check both users and admins tables
    const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND role = "admin"', [req.user.userId]);
    const [admins] = await pool.query('SELECT * FROM admins WHERE id = ?', [req.user.userId]);

    console.log('User role query result:', users);
    console.log('Admin query result:', admins);

    if (users.length === 0 && admins.length === 0) {
      console.log('Access denied: Not an admin');
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = { auth, isAdmin }; 
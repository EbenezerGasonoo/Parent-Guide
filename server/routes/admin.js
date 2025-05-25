const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const JWT_SECRET = 'your-secret-key-here'; // Match the secret in auth.js

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, name, email, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create new user
router.post('/users', auth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ 
      id: result.insertId,
      name,
      email,
      role
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user
router.put('/users/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active } = req.body;

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
      [name, email, role, is_active, id]
    );

    res.json({ 
      id,
      name,
      email,
      role,
      is_active
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get total students
    const [students] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['student']);
    
    // Get total teachers
    const [teachers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['teacher']);
    
    // Get total parents
    const [parents] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['parent']);

    res.json({
      totalStudents: students[0].count,
      totalTeachers: teachers[0].count,
      totalParents: parents[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Admin registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Admin registration attempt for:', email);

    // Check if admin already exists
    const [existingAdmins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Create token
    const token = jwt.sign(
      { userId: result.insertId, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Admin registration successful for:', email);
    res.status(201).json({ 
      token,
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Test route to check admin credentials
router.get('/test', async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT * FROM admins');
    console.log('All admins:', admins);
    res.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt for:', email);

    // Find admin
    const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = admins[0];

    if (!admin) {
      console.log('Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Admin found:', admin);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      console.log('Invalid password for admin:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified for admin:', email);

    // Create token
    const token = jwt.sign(
      { userId: admin.id, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for admin:', email);
    res.json({ token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

module.exports = router; 
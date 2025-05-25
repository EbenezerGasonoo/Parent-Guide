const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, authHelpers } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- Test Route ---
router.get('/test', (req, res) => {
  console.log('Test route /api/auth/test accessed');
  res.json({ message: 'Auth test route is working!' });
});

// General Register route (can keep for other roles or remove if only specific role registration is needed)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role (ensure it's not 'parent' if we have a dedicated parent route)
    if (role === 'parent') {
        return res.status(400).json({ message: 'Please use the dedicated parent registration endpoint.' });
    }

    if (!['teacher', 'admin'].includes(role)) { // Adjust allowed roles if necessary
      return res.status(400).json({ message: 'Invalid role. Must be teacher or admin.' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, is_email_verified) VALUES (?, ?, ?, ?, ?)',
      [name, email.toLowerCase(), hashedPassword, role, false]
    );

    // Create token
    const token = jwt.sign(
      { userId: result.insertId, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        email: email.toLowerCase(),
        role,
        isEmailVerified: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during general registration' });
  }
});

// --- Parent Registration Route ---
router.post('/parent/register', async (req, res) => {
    try {
      const { name, email, password, phone, address, children } = req.body;

      // Basic validation
      if (!name || !email || !password || !phone || !address || !children || !Array.isArray(children)) {
          console.error('Validation Error: Missing required parent or children information.');
          return res.status(400).json({ message: 'Missing required parent or children information.' });
      }

      // Check if parent email already exists in users table (any role)
      const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
      if (existingUsers.length > 0) {
        console.error('Registration Error: User with email already exists.', email);
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create parent user in the users table
      const [userResult] = await pool.query(
        'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email.toLowerCase(), hashedPassword, 'parent', phone, address]
      );

      const parentId = userResult.insertId;

      // Insert children into the children table
      if (children.length > 0) {
          const childInsertPromises = children.map(child => {
              // Basic child validation
              if (!child.name || !child.age || !child.grade || !child.school) {
                  console.error('Validation Error: Skipping child insertion due to missing data.', child);
                  // Instead of throwing, we'll log and skip this child to allow registration if at least one child is valid
                  return Promise.resolve(); 
              }
              console.log('Inserting child:', child);
              return pool.query(
                  'INSERT INTO children (parent_id, name, age, grade, school) VALUES (?, ?, ?, ?, ?)',
                  [parentId, child.name, child.age, child.grade, child.school]
              );
          });
          // Execute all child insert promises, filtering out resolved promises from skipped children
          const results = await Promise.all(childInsertPromises);
          console.log('Child insertion results:', results);

           // Optional: Check if *any* children were successfully inserted
           if (results.filter(r => r && r.affectedRows > 0).length === 0 && children.length > 0) {
               console.warn('Warning: Parent registered, but no children were inserted (possibly due to validation).');
               // Consider rolling back parent creation here if children are mandatory
           }
      }

      // Create token
      const token = jwt.sign(
        { userId: parentId, role: 'parent' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Fetch the newly created parent user to return in the response (including phone and address)
      const [newParentUser] = await pool.query('SELECT id, name, email, role, is_email_verified, phone, address FROM users WHERE id = ?', [parentId]);

      console.log('Parent registered successfully:', email);
      res.status(201).json({
        message: 'Parent registered successfully',
        token,
        user: newParentUser[0]
      });

    } catch (error) {
      console.error('Parent registration database error:', error);
      // Provide a more specific error message in development, but generic in production
      const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Server error during parent registration';
      res.status(500).json({ message: errorMessage });
    }
});

// Teacher login route
router.post('/teacher/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Teacher login attempt for:', email);

    // Find teacher
    const teacher = await authHelpers.findTeacherByEmail(email);
    if (!teacher) {
      console.log('Teacher not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: teacher.id, role: 'teacher' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        isEmailVerified: teacher.is_email_verified
      }
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Parent login route
router.post('/parent/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Parent login attempt for:', email);

    // Find parent
    const parent = await authHelpers.findParentByEmail(email);
    if (!parent) {
      console.log('Parent not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: parent.id, role: 'parent' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        role: 'parent',
        isEmailVerified: parent.is_email_verified
      }
    });
  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin login route
router.post('/admin/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Admin login attempt for:', email);

    // Find admin
    const admin = await authHelpers.findAdminByEmail(email);
    if (!admin) {
      console.log('Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: admin.id, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
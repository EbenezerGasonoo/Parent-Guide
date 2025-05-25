const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // default XAMPP password is empty
  database: process.env.DB_NAME || 'parent_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Initialize database
async function initializeDatabase() {
  try {
    // Clear existing users
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM admins');
    await pool.query('DELETE FROM children');
    console.log('Cleared existing users');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'parent', 'teacher') NOT NULL DEFAULT 'parent',
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create children table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS children (
          id INT AUTO_INCREMENT PRIMARY KEY,
          parent_id INT NOT NULL,
          name VARCHAR(100) NOT NULL,
          age INT,
          grade VARCHAR(50),
          school VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create admins table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create default users with empty passwords
    const emptyPassword = await bcrypt.hash('', 10);

    // Create admin user
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_email_verified) 
      VALUES ('Admin User', 'admin@admin.com', ?, 'admin', true)
    `, [emptyPassword]);
    console.log('Admin user created in users table');

    // Create default teacher
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_email_verified)
      VALUES ('Default Teacher', 'teacher@school.com', ?, 'teacher', true)
    `, [emptyPassword]);
    console.log('Default teacher created in users table');

    // Create default parent
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_email_verified) 
      VALUES ('Default Parent', 'parent@school.com', ?, 'parent', true)
    `, [emptyPassword]);
    console.log('Default parent created in users table');

    // Create admin in admins table
    await pool.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      ['Admin User', 'admin@admin.com', emptyPassword]
    );
    console.log('Default admin created in admins table');

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Helper functions for authentication
const authHelpers = {
  // Admin authentication (checking admins table)
  async findAdminByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email.toLowerCase()]);
    return rows[0];
  },

  // Parent authentication (checking users table with role parent)
  async findParentByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), 'parent']);
    return rows[0];
  },

  // Teacher authentication (checking users table with role teacher)
  async findTeacherByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email.toLowerCase(), 'teacher']);
    return rows[0];
  },

  // Create new user (general registration)
  async createUser(userData) {
     const hashedPassword = await bcrypt.hash('', 10); // Empty password for all new users
     const [result] = await pool.query(
       'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
       [userData.name, userData.email.toLowerCase(), hashedPassword, userData.role]
     );
     return result.insertId;
  },

  // Create new parent user AND their children
  async createParentWithChildren(parentData) {
      const hashedPassword = await bcrypt.hash('', 10); // Empty password
      
      // Insert parent into users table
      const [userResult] = await pool.query(
          'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
          [parentData.name, parentData.email.toLowerCase(), hashedPassword, 'parent', parentData.phone, parentData.address]
      );

      const parentId = userResult.insertId;

      // Insert children into children table
      if (parentData.children && Array.isArray(parentData.children) && parentData.children.length > 0) {
          const childInsertPromises = parentData.children.map(child => {
               // Basic validation for child data within the helper
               if (!child.name || !child.age || !child.grade || !child.school) {
                   console.error('Skipping child insertion due to missing data:', child);
                   return Promise.resolve(); // Skip this child but continue with others
               }
              return pool.query(
                  'INSERT INTO children (parent_id, name, age, grade, school) VALUES (?, ?, ?, ?, ?)',
                  [parentId, child.name, child.age, child.grade, child.school]
              );
          });
          await Promise.all(childInsertPromises.filter(promise => promise !== null)); // Filter out skipped promises
      }

      // Fetch the newly created parent user to return
      const [newParentUser] = await pool.query('SELECT id, name, email, role, is_email_verified, phone, address FROM users WHERE id = ?', [parentId]);

      return newParentUser[0]; // Return the created user object
  }
};

module.exports = {
  pool,
  initializeDatabase,
  authHelpers
}; 
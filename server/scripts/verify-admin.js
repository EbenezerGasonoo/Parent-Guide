const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function verifyAdminSetup() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // default XAMPP password is empty
      database: 'parent_db'
    });

    console.log('Connected to database');

    // Check if admins table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "admins"');
    if (tables.length === 0) {
      console.error('Error: admins table does not exist!');
      return;
    }
    console.log('Admins table exists');

    // Check admin account
    const [admins] = await connection.query('SELECT * FROM admins WHERE email = ?', ['admin@admin.com']);
    
    if (admins.length === 0) {
      console.log('Admin account not found. Creating default admin...');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await connection.query(
        'INSERT INTO admins (name, email, password, is_email_verified) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@admin.com', hashedPassword, true]
      );
      console.log('Default admin account created');
    } else {
      console.log('Admin account found:', {
        id: admins[0].id,
        email: admins[0].email,
        is_verified: admins[0].is_email_verified
      });
    }

    // Test admin login
    const admin = admins[0] || (await connection.query('SELECT * FROM admins WHERE email = ?', ['admin@admin.com']))[0][0];
    if (admin) {
      const isValidPassword = await bcrypt.compare('Admin123!', admin.password);
      console.log('Password verification test:', isValidPassword ? 'SUCCESS' : 'FAILED');
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyAdminSetup(); 
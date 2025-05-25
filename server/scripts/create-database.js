const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // default XAMPP password is empty
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS parent_db');
    console.log('Database parent_db created successfully');

    // Switch to the database
    await connection.query('USE parent_db');
    console.log('Switched to parent_db database');

    await connection.end();
    console.log('Database setup completed');
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

createDatabase(); 
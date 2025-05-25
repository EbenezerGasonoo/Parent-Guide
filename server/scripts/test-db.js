const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // default XAMPP password is empty
      database: 'parent_guide'
    });

    console.log('Successfully connected to MySQL database!');
    
    // Test query
    const [rows] = await connection.query('SELECT 1');
    console.log('Test query successful:', rows);

    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

testConnection(); 
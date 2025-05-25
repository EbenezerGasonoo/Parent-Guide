const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function setupParentDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // default XAMPP password is empty
    });

    console.log('Connected to MySQL server');

    // Read and execute parent_schema.sql
    const schemaPath = path.join(__dirname, '../database/parent_schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim())
      .map(statement => statement + ';');

    // Execute each statement
    for (const statement of statements) {
      await connection.query(statement);
      console.log('Executed:', statement.trim().substring(0, 50) + '...');
    }

    console.log('Parent database and tables created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error setting up parent database:', error);
  }
}

setupParentDatabase(); 
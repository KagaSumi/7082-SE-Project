// services/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.MYSQL_USER || 'Praxis',
  password: process.env.MYSQL_PASSWORD || 'your_praxis_password',
  database: process.env.MYSQL_DATABASE || 'qa_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


const pool = mysql.createPool(dbConfig);

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };

import sql from 'mysql2/promise'; // Using the promise-based version of mysql2
import dotenv from 'dotenv';
dotenv.config();

// Create a MySQL connection pool
const pool = sql.createPool({
  host: process.env.DB_SERVER, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, 
  connectionLimit: 10,
  queueLimit: 0,
});

// Handle connection errors
pool.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL!');
    connection.release(); // Release the connection
  })
  .catch((error) => {
    console.error('Error connecting to MySQL:', error);
  });

export default pool;

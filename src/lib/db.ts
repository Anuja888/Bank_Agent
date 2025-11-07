import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function executeQuery({ query, values = [] }: { query: string; values?: any[] }) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

const Pool =require('pg').Pool

const pool = new Pool({
  user:"postgres",
  password:"",
  database:"homework4",
  host: "localhost",
  port: "5433",
});



async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

createTables();

module.exports = pool;

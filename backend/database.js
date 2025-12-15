const Pool =require('pg').Pool

const pool = new Pool({
  user:"hw4user",
  password:"password",
  database:"homework4",
  host: "localhost",
  port: "5432",
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
      date TIMESTAMP NOT NULL
    )
  `);
}

createTables();

module.exports = pool;

const { Pool } = require('pg')

const pool = process.env.NODE_ENV !== 'production' ? (
  new Pool({
    connectionString: process.env.DATABASE_URL
  })
) : (
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
);

module.exports = {
  query: (text, params) => pool.query(text, params),
}
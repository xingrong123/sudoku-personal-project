const { Pool } = require('pg')
const dbUrl = process.env.NODE_ENV !== 'production' ? process.env.DATABASE_URL : process.env.DATABASE_URL + '?ssl=true'

const pool = new Pool({
  connectionString: dbUrl,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
// db.js
console.log('Starting server...');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL config if necessary
});

module.exports = pool;

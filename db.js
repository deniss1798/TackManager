// db.js
console.log('Starting server...');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL config if necessary
});

async function findTaskById(id) {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE taskid = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0]; // возвращаем задачу, если найдена
    }
    return null; // возвращаем null, если задача не найдена
  } catch (error) {
    console.error('Error finding task:', error);
    throw error;
  }
}

async function findUserById(id) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0]; // возвращаем пользователя, если найден
    }
    return null; // возвращаем null, если пользователь не найден
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}



// Экспортируем pool и функции для использования в других файлах
module.exports = { pool, findTaskById, findUserById };

//index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('./userRoutes');
const path = require('path');
const { registerUser, loginUser, authenticateToken } = require('./auth');
const { Pool } = require('pg');
const pool = require('./db');

const app = express();

// Разрешить все источники
app.use(cors());
app.use(express.json());


// index.js

// Подключение маршрутов для пользователей
app.use('/users', userRoutes);

// Маршрут для входа пользователя
app.post('/login', loginUser);

// Маршрут для регистрации нового пользователя
app.post('/register', registerUser);

// Маршрут для успешной авторизации
app.get('/success', (req, res) => {
  res.send('Это страница после успешной авторизации');
});




// Определение маршрута для страницы пользователя
app.get('/user-profile', (req, res) => {
  // Отправляем файл UserProfile.vue
  res.sendFile(path.join(__dirname, 'path/to/UserProfile.vue'));
});

// Простой тестовый маршрут
app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Создание задачи
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, authorid, assigneeid, deadline, status } = req.body;

    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, authorid, assigneeid, deadline, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, authorid, assigneeid, deadline, status]
    );

    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Обновление задачи
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, assigneeid, description } = req.body;

  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET status = $1, assigneeid = $2, description = $3 WHERE taskid = $4 RETURNING *',
      [status, assigneeid, description, id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Удаление задачи
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await pool.query('DELETE FROM tasks WHERE taskid = $1 RETURNING *', [id]);

    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Экспортируем приложение express для использования в других модулях
module.exports = app;
